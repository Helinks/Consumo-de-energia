import React, { useState, useEffect } from 'react'
import HeaderWithBack from '../../assets/components/header/headerWithBack'
import Styles from './css/calcularConsumo.module.css'
import {
    Container,
    Row,
    Col,
    InputGroup,
    Form,
    Button,
    Spinner
} from 'react-bootstrap'

import { useNavigate } from 'react-router-dom'

const API_BASE_URL = 'http://localhost:3000/api';

function CalcularConsumo() {

    const navigate = useNavigate();

    const [apartments, setApartments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    const [kwConsumidos, setKwConsumidos] = useState('');
    const [precioEnergiaConsumida, setPrecioEnergiaConsumida] = useState('');
    const [precioAseo, setPrecioAseo] = useState('');

    const [contadores, setContadores] = useState({});

    useEffect(() => {

        const fetchApartments = async () => {

            try {

                const res = await fetch(`${API_BASE_URL}/apartamentos/calcular`);
                const data = await res.json();

                if (Array.isArray(data.message)) {

                    setApartments(data.message);

                    const initialCounters = {};

                    data.message.forEach(apt => {
                        initialCounters[apt.idApartamento] = '';
                    });

                    setContadores(initialCounters);
                }

            } catch (error) {

                console.error('Error al cargar apartamentos:', error);

            } finally {

                setLoading(false);

            }
        };

        fetchApartments();

    }, []);

    const handleContadorChange = (id, value) => {

        setContadores(prev => ({
            ...prev,
            [id]: value
        }));

    };

    const handleCalculate = async () => {

        if (!kwConsumidos || !precioEnergiaConsumida || !precioAseo) {

            alert('Completa todos los campos.');
            return;

        }

        const tenantApartments = apartments.filter(apt => apt.idRol === 2);

        const allTenantsHaveReading = tenantApartments.every(apt => {

            const val = Number(contadores[apt.idApartamento]);

            return !isNaN(val) && val > 0;

        });

        if (!allTenantsHaveReading) {

            alert('Ingresa las lecturas de todos los apartamentos.');
            return;

        }

        const numeroContador = apartments.map(
            apt => Number(contadores[apt.idApartamento])
        );

        setSubmitting(true);

        try {

            const response = await fetch(`${API_BASE_URL}/recibos/crear`, {

                method: 'POST',

                headers: {
                    'Content-Type': 'application/json'
                },

                body: JSON.stringify({

                    kwConsumidos: Number(kwConsumidos),

                    precioEnergiaConsumida: Number(precioEnergiaConsumida),

                    precioAseo: Number(precioAseo),

                    lecturas: contadores,

                    numeroContador

                })

            });

            if (response.ok) {

                const result = await response.json();

                navigate('/resultados', {
                    state: { reciboId: result.reciboId }
                });

            } else {

                const err = await response.json();

                alert(err.error || 'Error al calcular.');

            }

        } catch (error) {

            console.error(error);

            alert('Error de conexión.');

        } finally {

            setSubmitting(false);

        }
    };

    if (loading) {

        return (
            <>
                <HeaderWithBack />

                <div className={Styles.loaderContainer}>
                    <Spinner animation="border" className={Styles.spinner} />
                </div>
            </>
        );
    }

    return (
        <>
            <HeaderWithBack />

            <div className={Styles.page}>

                {/* decoración */}
                <div className={Styles.sideDecoration}>
                    <span className={`${Styles.circle} ${Styles.active}`}></span>
                    <span className={Styles.line}></span>
                    <span className={Styles.circle}></span>
                    <span className={Styles.line}></span>
                    <span className={Styles.circle}></span>
                </div>

                {/* HERO */}
                <section className={Styles.hero}>

                    <p className={Styles.subtitle}>
                        Gestión energética
                    </p>

                    <h1 className={Styles.title}>
                        Calcular <br />
                        consumo
                    </h1>

                    <p className={Styles.description}>
                        Registra lecturas eléctricas y calcula
                        automáticamente los consumos de cada apartamento.
                    </p>

                </section>

                {/* FORM PRINCIPAL */}
                <section className={Styles.section}>

                    <Container fluid>

                        <Row className='g-4'>

                            <Col xl={4}>
                                <div className={Styles.inputCard}>

                                    <label>KW consumidos</label>

                                    <InputGroup>
                                        <Form.Control
                                            placeholder='0'
                                            type="number"
                                            value={kwConsumidos}
                                            onChange={(e) => setKwConsumidos(e.target.value)}
                                            className={Styles.input}
                                        />
                                    </InputGroup>

                                </div>
                            </Col>

                            <Col xl={4}>
                                <div className={Styles.inputCard}>

                                    <label>Precio consumo</label>

                                    <InputGroup>
                                        <Form.Control
                                            placeholder='0'
                                            type="number"
                                            value={precioEnergiaConsumida}
                                            onChange={(e) => setPrecioEnergiaConsumida(e.target.value)}
                                            className={Styles.input}
                                        />
                                    </InputGroup>

                                </div>
                            </Col>

                            <Col xl={4}>
                                <div className={Styles.inputCard}>

                                    <label>Precio aseo</label>

                                    <InputGroup>
                                        <Form.Control
                                            placeholder='0'
                                            type="number"
                                            value={precioAseo}
                                            onChange={(e) => setPrecioAseo(e.target.value)}
                                            className={Styles.input}
                                        />
                                    </InputGroup>

                                </div>
                            </Col>

                        </Row>

                    </Container>

                </section>

                {/* APARTAMENTOS */}
                <section className={Styles.apartmentSection}>

                    <div className={Styles.sectionHeader}>
                        <p>Lecturas actuales</p>
                        <h2>Apartamentos</h2>
                    </div>

                    <Container fluid>

                        <Row className='g-4'>

                            {apartments.map((apt) => (

                                apt.idRol === 2 && (

                                    <Col xl={6} key={apt.idApartamento}>

                                        <div className={Styles.apartmentCard}>

                                            <div className={Styles.cardTop}>
                                                <div className={Styles.icon}>
                                                    ⚡
                                                </div>

                                                <div>
                                                    <h3>{apt.descripcion}</h3>
                                                    {(apt.nombres || apt.responsable_nombre) && (
                                                        <p className={Styles.tenantName}>
                                                            Inquilino: <strong>{apt.nombres || apt.responsable_nombre}</strong>
                                                        </p>
                                                    )}
                                                    <p>
                                                        Lectura actual del medidor
                                                    </p>
                                                </div>
                                            </div>

                                            <InputGroup>

                                                <Form.Control
                                                    placeholder='Lectura en KW'
                                                    type="number"
                                                    value={contadores[apt.idApartamento] || ''}
                                                    onChange={(e) =>
                                                        handleContadorChange(
                                                            apt.idApartamento,
                                                            e.target.value
                                                        )
                                                    }
                                                    className={Styles.input}
                                                />

                                            </InputGroup>

                                        </div>

                                    </Col>

                                )

                            ))}

                        </Row>

                    </Container>

                </section>

                {/* BOTÓN */}
                <div className={Styles.buttonContainer}>

                    <Button
                        className={Styles.calculateButton}
                        onClick={handleCalculate}
                        disabled={submitting}
                    >
                        {submitting ? 'Calculando...' : 'Calcular consumo →'}
                    </Button>

                </div>

            </div>
        </>
    )
}

export default CalcularConsumo