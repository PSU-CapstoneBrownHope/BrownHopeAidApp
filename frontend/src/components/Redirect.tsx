import React, { useState, SyntheticEvent, useEffect } from "react";
import styles from "../styles/Buttons.module.css"
import axios from "axios";
import { routes } from "../util/config";
import { useParams, useNavigate, Link } from "react-router-dom";

export const Redirect = (): JSX.Element => {
  const { id } = useParams()

  return (
    <div>ID: {id}</div>
  )
}