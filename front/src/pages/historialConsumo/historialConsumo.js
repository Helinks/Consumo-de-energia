import React, { useState, useEffect } from 'react'
import HeaderWithBack from '../../assets/components/header/headerWithBack'
import { Table, Button, Spinner } from 'react-bootstrap'
import Style from './css/historialConsumo.module.css'
import { Link } from 'react-router-dom'
import formatNumber from '../../utils/formatNumber'

const API_BASE_URL = 'http://localhost:3000/api'

function HistorialConsumo() {
    const [recibos, setRecibos] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchRecibos = async () => {
            try {
                const res = await fetch(`${API_BASE_URL}/recibos`)
                const data = await res.json()

                if (Array.isArray(data.message)) {
                    setRecibos(data.message)
                }
            } catch (error) {
                console.error('Error al cargar historial:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchRecibos()
    }, [])

    const formatDate = (dateStr) => {
        const d = new Date(dateStr)

        return d.toLocaleDateString('es-CO', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
        })
    }

    if (loading) {
        return (
            <>
                <HeaderWithBack />

                <div className={Style.loadingContainer}>
                    <Spinner animation="border" className={Style.spinner} />
                </div>
            </>
        )
    }

    return (
        <>
            <HeaderWithBack />

            <div className={Style.container}>
                {/* DECORACIÓN */}
                <div className={Style.timeline}>
                    <span></span>
                    <span></span>
                    <span className={Style.active}></span>
                </div>

                {/* HERO */}
                <div className={Style.hero}>
                    <p className={Style.sectionTag}>Consumo</p>

                    <h1>
                        Historial de <br />
                        Consumo
                    </h1>

                    <p className={Style.description}>
                        Consulta el registro completo de tus recibos,
                        consumo energético y valores facturados.
                    </p>
                </div>

                {/* TABLA */}
                <div className={Style.tableContainer}>
                    <Table responsive borderless className={Style.customTable}>
                        <thead>
                            <tr>
                                <th>Fecha</th>
                                <th>Precio consumo</th>
                                <th>Total</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>

                        <tbody>
                            {recibos.length > 0 ? (
                                recibos.map((r) => (
                                    <tr key={r.idRecibo}>
                                        <td>
                                            {formatDate(r.fechaCreacion)}
                                        </td>

                                        <td>
                                            $
                                            {formatNumber(
                                                r.precioEnergiaConsumida
                                            )}
                                        </td>

                                        <td>
                                            $
                                            {formatNumber(r.precioTotal)}
                                        </td>

                                        <td>
                                            <Link
                                                to="/resultadoHistorial"
                                                state={{
                                                    reciboId: r.idRecibo,
                                                }}
                                            >
                                                <Button
                                                    className={Style.viewButton}
                                                >
                                                    Ver más
                                                </Button>
                                            </Link>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td
                                        colSpan="4"
                                        className={Style.empty}
                                    >
                                        No hay recibos registrados.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </Table>
                </div>
            </div>
        </>
    )
}

export default HistorialConsumo