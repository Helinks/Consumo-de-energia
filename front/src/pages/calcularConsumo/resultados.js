/* ===========================
   RESULTADOS.JSX
=========================== */

import React, { useState, useEffect, useRef } from 'react'
import {
  Button,
  Spinner,
  Modal,
  InputGroup,
  Form,
  Row,
  Col,
  Container
} from 'react-bootstrap'

import { useNavigate, useLocation } from 'react-router-dom'

import Header from '../../assets/components/header/header'

import Styles from './css/resultados.module.css'

import formatNumber from '../../utils/formatNumber'

const API_BASE_URL = 'http://localhost:3000/api';

function EditarConsumoModal({
  show,
  onHide,
  recibo,
  consumos,
  onSave
}) {

  const [kwConsumidos, setKwConsumidos] = useState('');
  const [precioEnergiaConsumida, setPrecioEnergiaConsumida] = useState('');
  const [precioAseo, setPrecioAseo] = useState('');
  const [lecturas, setLecturas] = useState({});

  useEffect(() => {

    if (recibo) {

      setKwConsumidos(String(recibo.kwConsumidos || ''));
      setPrecioEnergiaConsumida(String(recibo.precioEnergiaConsumida || ''));
      setPrecioAseo(String(recibo.precioAseo || ''));

    }

    if (consumos.length > 0) {

      const initial = {};

      consumos.forEach(c => {

        initial[c.idConsumo] =
          c.idRol === 2 ? String(c.kw || '') : '';

      });

      setLecturas(initial);
    }

  }, [recibo, consumos, show]);

  const handleSave = async () => {

    if (!kwConsumidos || !precioEnergiaConsumida || !precioAseo) {

      alert('Completa todos los campos.');
      return;

    }

    const tenantConsumos = consumos.filter(c => c.idRol === 2);

    const allTenantsHaveReading = tenantConsumos.every(c => {

      const val = Number(lecturas[c.idConsumo]);

      return !isNaN(val) && val > 0;

    });

    if (!allTenantsHaveReading) {

      alert('Ingresa las lecturas.');
      return;

    }

    const numeroContador = consumos.map(c => {

      if (c.idRol === 2)
        return Number(lecturas[c.idConsumo]);

      return 0;

    });

    try {

      const response = await fetch(
        `${API_BASE_URL}/recibos/editar-consumo/${recibo.idRecibo}`,
        {

          method: 'PUT',

          headers: {
            'Content-Type': 'application/json'
          },

          body: JSON.stringify({

            kwConsumidos: Number(kwConsumidos),

            precioEnergiaConsumida:
              Number(precioEnergiaConsumida),

            precioAseo: Number(precioAseo),

            lecturas,

            numeroContador

          })

        }
      );

      if (response.ok) {

        onSave();
        onHide();

      } else {

        const err = await response.json();

        alert(err.error || 'Error al actualizar');

      }

    } catch (error) {

      console.error(error);

      alert('Error de conexión');

    }
  };

  return (

    <Modal
      show={show}
      onHide={onHide}
      size="xl"
      centered
      dialogClassName={Styles.darkModal}
    >

      <Modal.Header closeButton className={Styles.modalHeader}>
        <Modal.Title>Editar consumo</Modal.Title>
      </Modal.Header>

      <Modal.Body className={Styles.modalBody}>

        <div className={Styles.modalSection}>

          <p className={Styles.modalSubtitle}>
            Datos generales
          </p>

          <Row className='g-4'>

            <Col xl={4}>

              <div className={Styles.inputCard}>

                <label>KW Consumido</label>

                <InputGroup>
                  <Form.Control
                    type="number"
                    value={kwConsumidos}
                    onChange={(e) =>
                      setKwConsumidos(e.target.value)
                    }
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
                    type="number"
                    value={precioEnergiaConsumida}
                    onChange={(e) =>
                      setPrecioEnergiaConsumida(e.target.value)
                    }
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
                    type="number"
                    value={precioAseo}
                    onChange={(e) =>
                      setPrecioAseo(e.target.value)
                    }
                    className={Styles.input}
                  />
                </InputGroup>

              </div>

            </Col>

          </Row>

        </div>

        <div className={Styles.modalSection}>

          <p className={Styles.modalSubtitle}>
            Lecturas actuales
          </p>

          <Row className='g-4'>

            {consumos
              .filter(c => c.idRol === 2)
              .map(c => (

                <Col xl={6} key={c.idConsumo}>

                  <div className={Styles.apartmentCard}>

                    <h3>{c.apartamento_descripcion}</h3>
                    {c.responsable_nombre && (
                      <p style={{ margin: '4px 0 8px 0', color: '#ff4d67', fontSize: '15px' }}>
                        Inquilino: <strong style={{ color: '#fff' }}>{c.responsable_nombre}</strong>
                      </p>
                    )}

                    <p>
                      Lectura actual del medidor
                    </p>

                    <InputGroup>

                      <Form.Control
                        type="number"
                        placeholder='Lectura actual'
                        value={lecturas[c.idConsumo] || ''}
                        onChange={(e) =>
                          setLecturas(prev => ({
                            ...prev,
                            [c.idConsumo]: e.target.value
                          }))
                        }
                        className={Styles.input}
                      />

                    </InputGroup>

                  </div>

                </Col>

              ))}

          </Row>

        </div>

      </Modal.Body>

      <Modal.Footer className={Styles.modalFooter}>

        <Button
          className={Styles.secondaryButton}
          onClick={onHide}
        >
          Cancelar
        </Button>

        <Button
          className={Styles.primaryButton}
          onClick={handleSave}
        >
          Guardar cambios
        </Button>

      </Modal.Footer>

    </Modal>

  );
}

const CONFIRM_MESSAGE =
  '¿Está seguro que desea dejar la página de resultados?';

function Resultados() {

  const location = useLocation();

  const navigate = useNavigate();

  const reciboId = location.state?.reciboId;

  const popStateHandlerRef = useRef(null);

  const [recibo, setRecibo] = useState(null);

  const [consumos, setConsumos] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState('');

  const [showEdit, setShowEdit] = useState(false);

  const [showExitConfirm, setShowExitConfirm] =
    useState(false);

  useEffect(() => {

    const handleBeforeUnload = (e) => {

      e.preventDefault();

      e.returnValue = '';

    };

    window.addEventListener(
      'beforeunload',
      handleBeforeUnload
    );

    return () =>
      window.removeEventListener(
        'beforeunload',
        handleBeforeUnload
      );

  }, []);

  useEffect(() => {

    window.history.pushState(null, '');

    const handlePopState = () => {

      window.history.pushState(null, '');

      setShowExitConfirm(true);

    };

    popStateHandlerRef.current = handlePopState;

    window.addEventListener(
      'popstate',
      handlePopState
    );

    return () =>
      window.removeEventListener(
        'popstate',
        handlePopState
      );

  }, []);

  const confirmExit = () => {

    setShowExitConfirm(false);

    if (popStateHandlerRef.current) {

      window.removeEventListener(
        'popstate',
        popStateHandlerRef.current
      );

    }

    navigate('/calcularConsumo');
  };

  const cancelExit = () => {

    setShowExitConfirm(false);

  };

  const handleLeaveClick = () => {

    if (window.confirm(CONFIRM_MESSAGE)) {

      if (popStateHandlerRef.current) {

        window.removeEventListener(
          'popstate',
          popStateHandlerRef.current
        );

      }

      navigate('/calcularConsumo');
    }
  };

  const fetchData = async () => {

    try {

      const [resRecibo, resConsumos] =
        await Promise.all([

          fetch(`${API_BASE_URL}/recibos/${reciboId}`),

          fetch(`${API_BASE_URL}/recibos/consumos/${reciboId}`)

        ]);

      const dataRecibo = await resRecibo.json();

      const dataConsumos = await resConsumos.json();

      if (resRecibo.ok)
        setRecibo(dataRecibo.message);

      else
        setError('Error al obtener el recibo.');

      if (
        resConsumos.ok &&
        Array.isArray(dataConsumos.message)
      ) {
        setConsumos(dataConsumos.message);
      }

    } catch (err) {

      console.error(err);

      setError('Error de conexión.');

    }
  };

  useEffect(() => {

    if (!reciboId) {

      setError('No se proporcionó un ID.');

      setLoading(false);

      return;
    }

    setLoading(true);

    fetchData().finally(() => setLoading(false));

  }, [reciboId]);

  if (loading) {

    return (
      <>
        <Header />

        <div className={Styles.loaderContainer}>
          <Spinner
            animation="border"
            className={Styles.spinner}
          />
        </div>
      </>
    );
  }

  if (error) {

    return (
      <>
        <Header />

        <div className={Styles.page}>

          <div className={Styles.errorCard}>

            <h1>Error</h1>

            <p>{error}</p>

            <Button
              className={Styles.primaryButton}
              onClick={handleLeaveClick}
            >
              Volver
            </Button>

          </div>

        </div>
      </>
    );
  }

  const precioKW = Number(recibo?.precioKw || 0);

  return (

    <>
      <Header />

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
            Resultado del cálculo
          </p>

          <h1 className={Styles.title}>
            Consumos <br />
            calculados
          </h1>

          <p className={Styles.description}>
            Consulta el detalle energético de
            cada apartamento y administra
            consumos fácilmente.
          </p>

        </section>

        {/* GRID */}

        <Container fluid>

          <Row className='g-4'>

            {consumos.map(c => (

              <Col xl={6} key={c.idConsumo}>

                <div className={Styles.resultCard}>

                  <div className={Styles.cardTop}>

                    <div className={Styles.icon}>
                      ⚡
                    </div>

                    <div>

                      <h2>
                        {c.apartamento_descripcion}
                      </h2>

                      <p>
                        Responsable:
                        {' '}
                        {c.responsable_nombre}
                      </p>

                    </div>

                  </div>

                  {c.idRol === 1 && (

                    <div className={Styles.ownerBadge}>
                      Dueño
                    </div>

                  )}

                  {c.idRol === 2 ? (

                    <div className={Styles.highlight}>
                      Lectura actual:
                      {' '}
                      {formatNumber(c.kw)} KW
                    </div>

                  ) : (

                    <div className={Styles.normalText}>
                      KW asignados:
                      {' '}
                      {formatNumber(c.kw)}
                    </div>

                  )}

                  <div className={Styles.infoRow}>
                    <span>KW consumidos</span>

                    <strong>
                      {c.kwConsumidos !== undefined
                        ? formatNumber(c.kwConsumidos)
                        : (precioKW > 0
                            ? formatNumber(
                                Number(c.precioConsumo) /
                                precioKW
                              )
                            : '0.00')}
                    </strong>
                  </div>

                  <div className={Styles.infoRow}>
                    <span>Precio consumo</span>

                    <strong>
                      ${formatNumber(c.precioConsumo)}
                    </strong>
                  </div>

                  <div className={Styles.infoRow}>
                    <span>Precio aseo</span>

                    <strong>
                      ${formatNumber(c.precioAseo)}
                    </strong>
                  </div>

                  <div className={Styles.totalRow}>
                    <span>Total</span>

                    <h3>
                      $
                      {formatNumber(
                        c.precioConsumoFinal
                      )}
                    </h3>
                  </div>

                </div>

              </Col>

            ))}

          </Row>

        </Container>

        {/* SUMMARY */}

        <section className={Styles.summarySection}>

          <h2>Resumen general</h2>

          <div className={Styles.summaryGrid}>

            <div className={Styles.summaryCard}>
              <p>Precio KW</p>
              <h3>${formatNumber(recibo?.precioKw)}</h3>
            </div>

            <div className={Styles.summaryCard}>
              <p>Precio aseo</p>
              <h3>${formatNumber(recibo?.precioAseo)}</h3>
            </div>

            <div className={Styles.summaryCard}>
              <p>Precio consumo</p>
              <h3>
                ${formatNumber(recibo?.precioEnergiaConsumida)}
              </h3>
            </div>

            <div className={Styles.summaryCard}>
              <p>KW consumidos</p>
              <h3>
                {formatNumber(recibo?.kwConsumidos)}
              </h3>
            </div>

          </div>

        </section>

        {/* BUTTONS */}

        <div className={Styles.buttonContainer}>

          <Button
            className={Styles.secondaryButton}
            onClick={() => setShowEdit(true)}
          >
            Editar
          </Button>

          <Button
            className={Styles.primaryButton}
            onClick={handleLeaveClick}
          >
            Volver a calcular
          </Button>

        </div>

      </div>

      {/* MODAL EDITAR */}

      <EditarConsumoModal
        show={showEdit}
        onHide={() => setShowEdit(false)}
        recibo={recibo}
        consumos={consumos}
        onSave={() => {
          fetchData();
        }}
      />

      {/* MODAL SALIDA */}

      <Modal
        show={showExitConfirm}
        onHide={cancelExit}
        centered
        dialogClassName={Styles.darkModal}
      >

        <Modal.Header closeButton className={Styles.modalHeader}>
          <Modal.Title>
            Confirmar salida
          </Modal.Title>
        </Modal.Header>

        <Modal.Body className={Styles.modalBody}>
          {CONFIRM_MESSAGE}
        </Modal.Body>

        <Modal.Footer className={Styles.modalFooter}>

          <Button
            className={Styles.secondaryButton}
            onClick={cancelExit}
          >
            Cancelar
          </Button>

          <Button
            className={Styles.primaryButton}
            onClick={confirmExit}
          >
            Salir
          </Button>

        </Modal.Footer>

      </Modal>

    </>
  )
}

export default Resultados