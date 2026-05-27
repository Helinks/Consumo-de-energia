import React from 'react'
import Header from '../../assets/components/header/header'
import Styles from './css/dashboard.module.css'
import { Link } from 'react-router-dom'

function Dashboard() {
    return (
        <>
            <Header />

            <div className={Styles.dashboardContainer}>

                {/* Decoración lateral */}
                <div className={Styles.sideDecoration}>
                    <span className={`${Styles.circle} ${Styles.active}`}></span>
                    <span className={Styles.line}></span>
                    <span className={Styles.circle}></span>
                    <span className={Styles.line}></span>
                    <span className={Styles.circle}></span>
                </div>

                {/* Hero */}
                <section className={Styles.hero}>
                    <p className={Styles.subtitle}>Panel principal</p>

                    <h1 className={Styles.title}>
                        Gestiona tus <br />
                        apartamentos
                    </h1>

                    <p className={Styles.description}>
                        Administra consumos, inquilinos y apartamentos
                        desde un dashboard moderno, limpio y minimalista.
                    </p>
                </section>

                {/* Opciones */}
                <section className={Styles.grid}>

                    <Link to={'/calcularConsumo'} className={Styles.link}>
                        <div className={Styles.card}>
                            <div className={Styles.icon}>⚡</div>
                            <h2>Calcular consumo</h2>
                            <p>
                                Registra y calcula nuevos consumos de energía.
                            </p>
                        </div>
                    </Link>

                    <Link to={'/inquilinos'} className={Styles.link}>
                        <div className={Styles.card}>
                            <div className={Styles.icon}>👤</div>
                            <h2>Gestionar inquilinos</h2>
                            <p>
                                Administra información y registros de inquilinos.
                            </p>
                        </div>
                    </Link>

                    <Link to={'/apartamentos'} className={Styles.link}>
                        <div className={Styles.card}>
                            <div className={Styles.icon}>🏢</div>
                            <h2>Gestionar apartamentos</h2>
                            <p>
                                Organiza apartamentos y sus configuraciones.
                            </p>
                        </div>
                    </Link>

                    <Link to={'/historial'} className={Styles.link}>
                        <div className={Styles.card}>
                            <div className={Styles.icon}>📊</div>
                            <h2>Historial de consumos</h2>
                            <p>
                                Consulta reportes y consumos anteriores.
                            </p>
                        </div>
                    </Link>

                </section>

            </div>
        </>
    )
}

export default Dashboard