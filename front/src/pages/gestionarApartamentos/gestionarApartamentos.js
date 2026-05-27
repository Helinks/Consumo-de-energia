/* =========================================
   GESTIONARAPARTAMENTOS.JSX
========================================= */

import React, { useState, useEffect } from 'react'

import {
  Button,
  Modal,
  InputGroup,
  Form,
  Badge
} from 'react-bootstrap'

import Style from './css/gestionarApartamentos.module.css'

import HeaderWithBack from '../../assets/components/header/headerWithBack'

const API_BASE_URL = 'http://localhost:3000/api';

/* =========================================
   MODAL AGREGAR
========================================= */

function AgregarApartamentoModal({
  show,
  onHide,
  inquilinos,
  onSave
}) {

  const [descripcion, setDescripcion] =
    useState('');

  const [idResponsable, setIdResponsable] =
    useState('');

  const handleSave = async () => {

    if (!descripcion.trim()) {

      alert('Ingresa una descripción.');
      return;

    }

    if (!idResponsable) {

      alert('Selecciona un responsable.');
      return;

    }

    try {

      const response = await fetch(
        `${API_BASE_URL}/apartamentos/crear`,
        {

          method: 'POST',

          headers: {
            'Content-Type': 'application/json'
          },

          body: JSON.stringify({

            idResponsable:
              Number(idResponsable),

            descripcion

          })

        }
      );

      if (response.ok) {

        setDescripcion('');

        setIdResponsable('');

        onSave();

        onHide();

      } else {

        const err = await response.json();

        alert(err.error || 'Error');

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
      centered
      size='lg'
      dialogClassName={Style.darkModal}
    >

      <Modal.Header
        closeButton
        className={Style.modalHeader}
      >

        <Modal.Title>
          Agregar apartamento
        </Modal.Title>

      </Modal.Header>

      <Modal.Body className={Style.modalBody}>

        <div className={Style.inputCard}>

          <label>Nombre / descripción</label>

          <InputGroup>

            <Form.Control
              placeholder='Ej: Apartamento 301'
              value={descripcion}
              onChange={(e) =>
                setDescripcion(e.target.value)
              }
              className={Style.input}
            />

          </InputGroup>

        </div>

        <div className={Style.inputCard}>

          <label>Responsable</label>

          <InputGroup>

            <Form.Select
              value={idResponsable}
              onChange={(e) =>
                setIdResponsable(e.target.value)
              }
              className={Style.input}
            >

              <option value="">
                Seleccionar responsable
              </option>

              {inquilinos.map(i => (

                <option
                  key={i.idResponsable}
                  value={i.idResponsable}
                >
                  {i.nombres}
                </option>

              ))}

            </Form.Select>

          </InputGroup>

        </div>

      </Modal.Body>

      <Modal.Footer className={Style.modalFooter}>

        <Button
          className={Style.secondaryButton}
          onClick={onHide}
        >
          Cancelar
        </Button>

        <Button
          className={Style.primaryButton}
          onClick={handleSave}
        >
          Guardar
        </Button>

      </Modal.Footer>

    </Modal>
  );
}

/* =========================================
   MODAL DETALLES
========================================= */

function DetallesApartamentoModal({

  show,
  onHide,
  apartamento,
  inquilinos,
  onSave,
  onDelete

}) {

  const [descripcion, setDescripcion] =
    useState('');

  const [idResponsable, setIdResponsable] =
    useState('');

  useEffect(() => {

    if (apartamento) {

      setDescripcion(
        apartamento.descripcion || ''
      );

      setIdResponsable(
        String(
          apartamento.Responsable_idResponsable || ''
        )
      );
    }

  }, [apartamento, show]);

  const handleUpdate = async () => {

    if (!descripcion.trim()) {

      alert('La descripción es obligatoria.');
      return;

    }

    try {

      const response = await fetch(
        `${API_BASE_URL}/apartamentos/actualizar`,
        {

          method: 'PUT',

          headers: {
            'Content-Type': 'application/json'
          },

          body: JSON.stringify({

            id: apartamento.idApartamento,

            idResponsable:
              Number(idResponsable),

            descripcion

          })

        }
      );

      if (response.ok) {

        onSave();

        onHide();

      } else {

        const err = await response.json();

        alert(err.error || 'Error');

      }

    } catch (error) {

      console.error(error);

      alert('Error de conexión');

    }
  };

  if (!apartamento) return null;

  return (

    <Modal
      show={show}
      onHide={onHide}
      centered
      size='lg'
      dialogClassName={Style.darkModal}
    >

      <Modal.Header
        closeButton
        className={Style.modalHeader}
      >

        <Modal.Title>
          Detalles del apartamento
        </Modal.Title>

      </Modal.Header>

      <Modal.Body className={Style.modalBody}>

        <div className={Style.detailsCard}>

          <div className={Style.inputCard}>

            <label>Descripción</label>

            <Form.Control
              value={descripcion}
              onChange={(e) =>
                setDescripcion(e.target.value)
              }
              className={Style.input}
            />

          </div>

          <div className={Style.inputCard}>

            <label>Responsable</label>

            <Form.Select
              value={idResponsable}
              onChange={(e) =>
                setIdResponsable(e.target.value)
              }
              className={Style.input}
            >

              <option value="">
                Ninguno
              </option>

              {inquilinos.map(i => (

                <option
                  key={i.idResponsable}
                  value={i.idResponsable}
                >
                  {i.nombres}
                </option>

              ))}

            </Form.Select>

          </div>

          <Button
            className={Style.deleteButton}
            onClick={() =>
              onDelete(apartamento.idApartamento)
            }
          >
            Eliminar apartamento
          </Button>

        </div>

      </Modal.Body>

      <Modal.Footer className={Style.modalFooter}>

        <Button
          className={Style.secondaryButton}
          onClick={onHide}
        >
          Cancelar
        </Button>

        <Button
          className={Style.primaryButton}
          onClick={handleUpdate}
        >
          Guardar cambios
        </Button>

      </Modal.Footer>

    </Modal>
  );
}

/* =========================================
   PAGE
========================================= */

function GestionarApartamentos() {

  const [apartamentos, setApartamentos] =
    useState([]);

  const [inquilinos, setInquilinos] =
    useState([]);

  const [showAdd, setShowAdd] =
    useState(false);

  const [showDetalles, setShowDetalles] =
    useState(false);

  const [selectedApartamento,
    setSelectedApartamento] =
    useState(null);

  const fetchData = async () => {

    try {

      const resApts = await fetch(
        `${API_BASE_URL}/apartamentos`
      );

      const dataApts = await resApts.json();

      const resInq = await fetch(
        `${API_BASE_URL}/responsables`
      );

      const dataInq = await resInq.json();

      if (Array.isArray(dataApts.message)) {

        setApartamentos(dataApts.message);

      }

      if (Array.isArray(dataInq.message)) {

        setInquilinos(dataInq.message);

      }

    } catch (error) {

      console.error(error);

    }
  };

  useEffect(() => {

    fetchData();

  }, []);

  const handleDelete = async (id) => {

    if (
      !window.confirm(
        '¿Eliminar este apartamento?'
      )
    ) return;

    try {

      const response = await fetch(
        `${API_BASE_URL}/apartamentos/borrar`,
        {

          method: 'DELETE',

          headers: {
            'Content-Type': 'application/json'
          },

          body: JSON.stringify({ id })

        }
      );

      if (response.ok) {

        setShowDetalles(false);

        fetchData();

      } else {

        const err = await response.json();

        alert(err.error || 'Error');

      }

    } catch (error) {

      console.error(error);

      alert('Error de conexión');

    }
  };

  const getResponsableName = (idResponsable) => {

    const found =
      inquilinos.find(
        i =>
          i.idResponsable ===
          idResponsable
      );

    return found
      ? found.nombres
      : 'Libre';
  };

  return (

    <>
      <HeaderWithBack />

      <div className={Style.page}>

        {/* decoración lateral */}

        <div className={Style.sideDecoration}>

          <span className={`${Style.circle} ${Style.active}`}></span>

          <span className={Style.line}></span>

          <span className={Style.circle}></span>

          <span className={Style.line}></span>

          <span className={Style.circle}></span>

        </div>

        {/* HERO */}

        <section className={Style.hero}>

          <p className={Style.subtitle}>
            Administración
          </p>

          <h1 className={Style.title}>
            Gestionar <br />
            apartamentos
          </h1>

          <p className={Style.description}>
            Organiza y administra
            apartamentos, responsables
            y ocupación desde un panel
            moderno y elegante.
          </p>

        </section>

        {/* TOP BAR */}

        <div className={Style.topBar}>

          <h2>
            Lista de apartamentos
          </h2>

          <Button
            className={Style.primaryButton}
            onClick={() => setShowAdd(true)}
          >
            Agregar +
          </Button>

        </div>

        {/* LIST */}

        <section className={Style.section}>

          <div className={Style.sectionHeader}>

            <p>Disponibles</p>

            <h3>
              Apartamentos registrados
            </h3>

          </div>

          <div className={Style.cardsGrid}>

            {apartamentos.length > 0 ? (

              apartamentos.map(apt => (

                <div
                  key={apt.idApartamento}
                  className={Style.card}
                >

                  <div className={Style.cardTop}>

                    <div>

                      <p className={Style.cardLabel}>
                        Apartamento
                      </p>

                      <h4>
                        {apt.descripcion}
                      </h4>

                    </div>

                    <Badge
                      className={
                        getResponsableName(
                          apt.Responsable_idResponsable
                        ) === 'Libre'
                          ? Style.freeBadge
                          : Style.activeBadge
                      }
                    >

                      {
                        getResponsableName(
                          apt.Responsable_idResponsable
                        ) === 'Libre'
                          ? 'Libre'
                          : 'Ocupado'
                      }

                    </Badge>

                  </div>

                  <div className={Style.cardInfo}>

                    <span>
                      Responsable
                    </span>

                    <strong>

                      {getResponsableName(
                        apt.Responsable_idResponsable
                      )}

                    </strong>

                  </div>

                  <Button
                    className={Style.infoButton}
                    onClick={() => {

                      setSelectedApartamento(apt);

                      setShowDetalles(true);

                    }}
                  >
                    Ver detalles
                  </Button>

                </div>

              ))

            ) : (

              <div className={Style.emptyCard}>

                No hay apartamentos registrados.

              </div>

            )}

          </div>

        </section>

      </div>

      {/* MODALS */}

      <AgregarApartamentoModal
        show={showAdd}
        onHide={() => setShowAdd(false)}
        inquilinos={inquilinos}
        onSave={fetchData}
      />

      <DetallesApartamentoModal
        show={showDetalles}
        onHide={() => {

          setShowDetalles(false);

          setSelectedApartamento(null);

        }}
        apartamento={selectedApartamento}
        inquilinos={inquilinos}
        onSave={fetchData}
        onDelete={handleDelete}
      />

    </>
  );
}

export default GestionarApartamentos;