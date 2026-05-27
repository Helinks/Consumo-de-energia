import React, { useState, useEffect } from 'react'
import Header from "../../assets/components/header/header"
import { Link, useLocation } from 'react-router-dom'
import { Button, Spinner, Row, Col } from "react-bootstrap"
import Styles from './css/resultadosHistorial.module.css'
import formatNumber from '../../utils/formatNumber'

const API_BASE_URL = 'http://localhost:3000/api'

function ResultadoHistorial() {
    const location = useLocation()
    const reciboId = location.state?.reciboId

    const [recibo, setRecibo] = useState(null)
    const [consumos, setConsumos] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        if (!reciboId) {
            setError('No se ha proporcionado un ID de recibo.')
            setLoading(false)
            return
        }

        const fetchData = async () => {
            try {
                const [resRecibo, resConsumos] = await Promise.all([
                    fetch(`${API_BASE_URL}/recibos/${reciboId}`),
                    fetch(`${API_BASE_URL}/recibos/consumos/${reciboId}`)
                ])

                const dataRecibo = await resRecibo.json()
                const dataConsumos = await resConsumos.json()

                if (resRecibo.ok) {
                    setRecibo(dataRecibo.message)
                } else {
                    setError('Error al obtener el recibo.')
                }

                if (
                    resConsumos.ok &&
                    Array.isArray(dataConsumos.message)
                ) {
                    setConsumos(dataConsumos.message)
                }
            } catch (err) {
                console.error('Error al cargar historial:', err)
                setError('Error de conexión con el servidor.')
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [reciboId])

    if (loading) {
        return (
            <>
                <Header />

                <div className={Styles.loadingContainer}>
                    <Spinner
                        animation="border"
                        className={Styles.spinner}
                    />
                </div>
            </>
        )
    }

    if (error) {
        return (
            <>
                <Header />

                <div className={Styles.container}>
                    <div className={Styles.errorCard}>
                        <h1>Error</h1>

                        <p>{error}</p>

                        <Link to="/historial">
                            <Button className={Styles.backButton}>
                                Volver atrás
                            </Button>
                        </Link>
                    </div>
                </div>
            </>
        )
    }

    const precioKW = Number(recibo?.precioKw || 0)

    const totalConsumo = consumos.reduce(
        (sum, c) => sum + Number(c.precioConsumo),
        0
    )

    const totalAseo = consumos.reduce(
        (sum, c) => sum + Number(c.precioAseo),
        0
    )

    const totalFinal = consumos.reduce(
        (sum, c) => sum + Number(c.precioConsumoFinal),
        0
    )

    return (
        <>
            <Header />

            <div className={Styles.container}>
                {/* DECORACIÓN */}
                <div className={Styles.timeline}>
                    <span></span>
                    <span className={Styles.active}></span>
                    <span></span>
                </div>

                {/* HERO */}
                <div className={Styles.hero}>
                    <p className={Styles.sectionTag}>
                        Recibo energético
                    </p>

                    <h1>
                        Resultados <br />
                        del Consumo
                    </h1>

                    <p className={Styles.description}>
                        Consulta el detalle energético y financiero
                        correspondiente al recibo seleccionado.
                    </p>
                </div>

                {/* DETALLE APARTAMENTOS */}
                <div className={Styles.section}>
                    <h2 className={Styles.sectionTitle}>
                        Detalle por apartamento
                    </h2>

                    <div className={Styles.cardsGrid}>
                        {consumos.map((c) => (
                            <div
                                key={c.idConsumo}
                                className={Styles.card}
                            >
                                <div className={Styles.cardHeader}>
                                    <h3>
                                        {c.apartamento_descripcion}
                                    </h3>

                                    {c.idRol == 1 && (
                                        <span className={Styles.badge}>
                                            Dueño
                                        </span>
                                    )}
                                </div>

                                <p>
                                    Responsable:
                                    <span>
                                        {c.responsable_nombre}
                                    </span>
                                </p>

                                {c.idRol == 2 ? (
                                    <p className={Styles.highlight}>
                                        Lectura actual:
                                        <span>
                                            {formatNumber(c.kw)} KW
                                        </span>
                                    </p>
                                ) : (
                                    <p>
                                        KW asignados:
                                        <span>
                                            {formatNumber(c.kw)} KW
                                        </span>
                                    </p>
                                )}

                                <p>
                                    KW consumidos:
                                    <span>
                                        {precioKW > 0
                                            ? formatNumber(
                                                  Number(
                                                      c.precioConsumo
                                                  ) / precioKW
                                              )
                                            : '0.00'}
                                    </span>
                                </p>

                                <p>
                                    Precio consumo:
                                    <span>
                                        $
                                        {formatNumber(
                                            c.precioConsumo
                                        )}
                                    </span>
                                </p>

                                <p>
                                    Precio aseo:
                                    <span>
                                        $
                                        {formatNumber(c.precioAseo)}
                                    </span>
                                </p>

                                <div className={Styles.total}>
                                    $
                                    {formatNumber(
                                        c.precioConsumoFinal
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* RESUMEN */}
                <div className={Styles.section}>
                    <h2 className={Styles.sectionTitle}>
                        Resumen financiero
                    </h2>

                    <Row className="g-4">
                        <Col md={4}>
                            <div className={Styles.summaryCard}>
                                <h3>Total consumo</h3>
                                <p>
                                    ${formatNumber(totalConsumo)}
                                </p>
                            </div>
                        </Col>

                        <Col md={4}>
                            <div className={Styles.summaryCard}>
                                <h3>Total aseo</h3>
                                <p>${formatNumber(totalAseo)}</p>
                            </div>
                        </Col>

                        <Col md={4}>
                            <div className={Styles.summaryCard}>
                                <h3>Total a pagar</h3>
                                <p>
                                    ${formatNumber(totalFinal)}
                                </p>
                            </div>
                        </Col>
                    </Row>
                </div>

                {/* OTROS DATOS */}
                <div className={Styles.section}>
                    <h2 className={Styles.sectionTitle}>
                        Información adicional
                    </h2>

                    <div className={Styles.infoCard}>
                        <div>
                            <span>Precio KW</span>
                            <p>
                                $
                                {formatNumber(recibo?.precioKw)}
                            </p>
                        </div>

                        <div>
                            <span>Precio aseo</span>
                            <p>
                                $
                                {formatNumber(recibo?.precioAseo)}
                            </p>
                        </div>

                        <div>
                            <span>Precio consumo</span>
                            <p>
                                $
                                {formatNumber(
                                    recibo?.precioEnergiaConsumida
                                )}
                            </p>
                        </div>

                        <div>
                            <span>KW consumidos</span>
                            <p>
                                {formatNumber(
                                    recibo?.kwConsumidos
                                )}
                            </p>
                        </div>
                    </div>
                </div>

                {/* BOTÓN */}
                <div className={Styles.actions}>
                    <Link to="/historial">
                        <Button className={Styles.backButton}>
                            Volver atrás
                        </Button>
                    </Link>
                </div>
            </div>
        </>
    )
}

export default ResultadoHistorial