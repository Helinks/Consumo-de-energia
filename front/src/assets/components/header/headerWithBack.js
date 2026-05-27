import React from 'react'
import styles from '../../css/header.module.css'
import back from './img/back.png'
import { Link } from 'react-router-dom'
function headerWithBack() {
  return (
    <div className={styles.header}>
      <Link to={"/"}>
      <img src={back} alt='back' className={styles.imgBack}></img>
      </Link>
        
    </div>
  )
}

export default headerWithBack