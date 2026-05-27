/* =========================================
   GESTIONARINQUILINOS.JSX
========================================= */

import React, { useState, useEffect } from 'react'

import HeaderWithBack from '../../assets/components/header/headerWithBack'

import {
  Button,
  Modal,
  Table,
  InputGroup,
  Form,
  Badge
} from 'react-bootstrap'

import Styles from './css/gestionarInquilinos.module.css'

const API_BASE_URL = 'http://localhost:3000/api';

/* =========================================
   MODAL AGREGAR
========================================= */

function AgregarInquilinoModal({
  show,
  onHide,
  onSave
}) {

  const [nombres, setNombres] = useState('');

  const handleSave = async () => {

    if (!nombres.trim()) {

      alert('Ingresa un nombre.');
      return;

    }

    try {

      const response = await fetch(
        `${API_BASE_URL}/responsables/crear`,
        {

          method: 'POST',

          headers: {
            'Content-Type': 'application/json'
          },

          body: JSON.stringify({ nombres })

        }
      );

      if (response.ok) {

        setNombres('');

        onSave();

        onHide();

      } else {

        const err = await response.json();

        alert(err.error || 'Error al guardar');

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
      dialogClassName={Styles.darkModal}
    >

      <Modal.Header closeButton className={Styles.modalHeader}>
        <Modal.Title>
          Agregar inquilino
        </Modal.Title>
      </Modal.Header>

      <Modal.Body className={Styles.modalBody}>

        <div className={Styles.inputCard}>

          <label>Nombre del inquilino</label>

          <InputGroup>

            <Form.Control
              placeholder="Ingresa el nombre"
              value={nombres}
              onChange={(e) =>
                setNombres(e.target.value)
              }
              className={Styles.input}
            />

          </InputGroup>

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
          Guardar
        </Button>

      </Modal.Footer>

    </Modal>
  );
}

/* =========================================
   MODAL EDITAR
========================================= */

function EditarInquilinoModal({
  show,
  onHide,
  inquilino,
  onSave
}) {

  const [nombres, setNombres] = useState('');

  const [idEstado, setIdEstado] = useState('1');

  useEffect(() => {

    if (inquilino) {

      setNombres(inquilino.nombres || '');

      setIdEstado(
        String(
          inquilino.Estado_idEstado || '1'
        )
      );
    }

  }, [inquilino, show]);

  const handleSave = async () => {

    if (!nombres.trim()) {

      alert('Ingresa un nombre.');
      return;

    }

    try {

      const response = await fetch(
        `${API_BASE_URL}/responsables/actualizar`,
        {

          method: 'PUT',

          headers: {
            'Content-Type': 'application/json'
          },

          body: JSON.stringify({

            id: inquilino.idResponsable,

            nombres,

            idEstado: Number(idEstado)

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
      centered
      size='lg'
      dialogClassName={Styles.darkModal}
    >

      <Modal.Header closeButton className={Styles.modalHeader}>
        <Modal.Title>
          Editar inquilino
        </Modal.Title>
      </Modal.Header>

      <Modal.Body className={Styles.modalBody}>

        <div className={Styles.inputCard}>

          <label>Nombre</label>

          <InputGroup>

            <Form.Control
              value={nombres}
              onChange={(e) =>
                setNombres(e.target.value)
              }
              className={Styles.input}
            />

          </InputGroup>

        </div>

        <div className={Styles.inputCard}>

          <label>Estado</label>

          <InputGroup>

            <Form.Select
              value={idEstado}
              onChange={(e) =>
                setIdEstado(e.target.value)
              }
              className={Styles.input}
            >

              <option value="1">
                Activo
              </option>

              <option value="2">
                Inactivo
              </option>

            </Form.Select>

          </InputGroup>

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

/* =========================================
   MODAL DETALLES
========================================= */

function DetallesInquilinoModal({
  show,
  onHide,
  inquilino,
  onDelete
}) {

  if (!inquilino) return null;

  return (

    <Modal
      show={show}
      onHide={onHide}
      centered
      size='lg'
      dialogClassName={Styles.darkModal}
    >

      <Modal.Header closeButton className={Styles.modalHeader}>
        <Modal.Title>
          Detalles del inquilino
        </Modal.Title>
      </Modal.Header>

      <Modal.Body className={Styles.modalBody}>

        <div className={Styles.detailsCard}>

          <div className={Styles.detailRow}>
            <span>Nombre</span>
            <strong>{inquilino.nombres}</strong>
          </div>

          <div className={Styles.detailRow}>
            <span>Estado</span>

            <Badge
              bg={
                inquilino.Estado_idEstado === 1
                  ? 'success'
                  : 'secondary'
              }
            >
              {inquilino.Estado_idEstado === 1
                ? 'Activo'
                : 'Inactivo'}
            </Badge>

          </div>

          <div className={Styles.detailRow}>
            <span>Fecha creación</span>
            <strong>{inquilino.fechaCreacion}</strong>
          </div>

          <div className={Styles.detailRow}>
            <span>Última actualización</span>
            <strong>{inquilino.fechaActualizacion}</strong>
          </div>

        </div>

      </Modal.Body>

      <Modal.Footer className={Styles.modalFooter}>

        <Button
          className={Styles.deleteButton}
          onClick={() =>
            onDelete(inquilino.idResponsable)
          }
        >
          Eliminar
        </Button>

        <Button
          className={Styles.secondaryButton}
          onClick={onHide}
        >
          Cerrar
        </Button>

      </Modal.Footer>

    </Modal>
  );
}

/* =========================================
   PAGE
========================================= */

function GestionarInquilinos() {

  const [inquilinos, setInquilinos] =
    useState([]);

  const [showAdd, setShowAdd] =
    useState(false);

  const [showEdit, setShowEdit] =
    useState(false);

  const [showDetails, setShowDetails] =
    useState(false);

  const [selectedInquilino, setSelectedInquilino] =
    useState(null);

  const fetchInquilinos = async () => {

    try {

      const response = await fetch(
        `${API_BASE_URL}/responsables`
      );

      const data = await response.json();

      if (Array.isArray(data.message)) {

        setInquilinos(data.message);

      } else {

        setInquilinos([]);

      }

    } catch (error) {

      console.error(error);

    }
  };

  useEffect(() => {

    fetchInquilinos();

  }, []);

  const handleDelete = async (id) => {

    if (
      !window.confirm(
        '¿Eliminar este inquilino?'
      )
    ) return;

    try {

      const response = await fetch(
        `${API_BASE_URL}/responsables/borrar`,
        {

          method: 'DELETE',

          headers: {
            'Content-Type': 'application/json'
          },

          body: JSON.stringify({ id })

        }
      );

      if (response.ok) {

        setShowDetails(false);

        fetchInquilinos();

      } else {

        const err = await response.json();

        alert(err.error || 'Error');

      }

    } catch (error) {

      console.error(error);

      alert('Error de conexión');

    }
  };

  const activos =
    inquilinos.filter(
      i => i.Estado_idEstado === 1
    );

  const inactivos =
    inquilinos.filter(
      i => i.Estado_idEstado !== 1
    );

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
            Administración
          </p>

          <h1 className={Styles.title}>
            Gestionar <br />
            inquilinos
          </h1>

          <p className={Styles.description}>
            Administra información,
            estados y registros de
            inquilinos desde un panel
            elegante y moderno.
          </p>

        </section>

        {/* ACTION BAR */}

        <div className={Styles.topBar}>

          <h2>
            Lista de inquilinos
          </h2>

          <Button
            className={Styles.primaryButton}
            onClick={() => setShowAdd(true)}
          >
            Agregar +
          </Button>

        </div>

        {/* ACTIVOS */}

        <section className={Styles.section}>

          <div className={Styles.sectionHeader}>

            <p>Disponibles</p>

            <h3>Inquilinos activos</h3>

          </div>

          <div className={Styles.tableContainer}>

            <Table
              borderless
              responsive
              className={Styles.table}
            >

              <thead>

                <tr>

                  <th>Nombre</th>

                  <th>Estado</th>

                  <th>Acciones</th>

                </tr>

              </thead>

              <tbody>

                {activos.length > 0 ? (

                  activos.map(i => (

                    <tr key={i.idResponsable}>

                      <td>{i.nombres}</td>

                      <td>

                        <span className={Styles.activeBadge}>
                          Activo
                        </span>

                      </td>

                      <td>

                        <div className={Styles.actions}>

                          <Button
                            className={Styles.infoButton}
                            size='sm'
                            onClick={() => {

                              setSelectedInquilino(i);

                              setShowDetails(true);

                            }}
                          >
                            Ver
                          </Button>

                          <Button
                            className={Styles.editButton}
                            size='sm'
                            onClick={() => {

                              setSelectedInquilino(i);

                              setShowEdit(true);

                            }}
                          >
                            Editar
                          </Button>

                        </div>

                      </td>

                    </tr>

                  ))

                ) : (

                  <tr>

                    <td
                      colSpan="3"
                      className='text-center'
                    >
                      No hay inquilinos activos
                    </td>

                  </tr>

                )}

              </tbody>

            </Table>

          </div>

        </section>

        {/* INACTIVOS */}

        <section className={Styles.section}>

          <div className={Styles.sectionHeader}>

            <p>Archivados</p>

            <h3>Inquilinos inactivos</h3>

          </div>

          <div className={Styles.tableContainer}>

            <Table
              borderless
              responsive
              className={Styles.table}
            >

              <thead>

                <tr>

                  <th>Nombre</th>

                  <th>Estado</th>

                  <th>Acciones</th>

                </tr>

              </thead>

              <tbody>

                {inactivos.length > 0 ? (

                  inactivos.map(i => (

                    <tr key={i.idResponsable}>

                      <td>{i.nombres}</td>

                      <td>

                        <span className={Styles.inactiveBadge}>
                          Inactivo
                        </span>

                      </td>

                      <td>

                        <div className={Styles.actions}>

                          <Button
                            className={Styles.infoButton}
                            size='sm'
                            onClick={() => {

                              setSelectedInquilino(i);

                              setShowDetails(true);

                            }}
                          >
                            Ver
                          </Button>

                          <Button
                            className={Styles.editButton}
                            size='sm'
                            onClick={() => {

                              setSelectedInquilino(i);

                              setShowEdit(true);

                            }}
                          >
                            Editar
                          </Button>

                        </div>

                      </td>

                    </tr>

                  ))

                ) : (

                  <tr>

                    <td
                      colSpan="3"
                      className='text-center'
                    >
                      No hay inquilinos inactivos
                    </td>

                  </tr>

                )}

              </tbody>

            </Table>

          </div>

        </section>

      </div>

      {/* MODALS */}

      <AgregarInquilinoModal
        show={showAdd}
        onHide={() => setShowAdd(false)}
        onSave={fetchInquilinos}
      />

      <EditarInquilinoModal
        show={showEdit}
        onHide={() => {

          setShowEdit(false);

          setSelectedInquilino(null);

        }}
        inquilino={selectedInquilino}
        onSave={fetchInquilinos}
      />

      <DetallesInquilinoModal
        show={showDetails}
        onHide={() => {

          setShowDetails(false);

          setSelectedInquilino(null);

        }}
        inquilino={selectedInquilino}
        onDelete={handleDelete}
      />

    </>
  );
}

export default GestionarInquilinos;