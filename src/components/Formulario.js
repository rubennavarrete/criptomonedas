import React, { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import Error from './Error';

import useMoneda from '../hooks/useMoneda';
import useCritomoneda from '../hooks/useCritomoneda';
import axios from 'axios';


//Stilos

const Boton = styled.input`
    margin-top: 20px;
    font-size: 20px;
    font-weight: bold;
    padding: 10px;
    background-color: #66A2FE;
    border: none;
    width: 100%;
    border-radius: 10px;
    color: #fff;
    transition: background-color .3s ease;

    &:hover {
        background-color: #326ac0;
        cursor: pointer;
    }
`;


const Formulario = ({ guardarMoneda, guardarCriptomoneda }) => {

    // State del estado de criptomonedas
    const [listacripto, guardarCriptomonedas] = useState([]);
    const [error, guardarError] = useState(false);

    const MONEDAS = [
        { codigo: 'USD', nombre: 'Dolar de Estados Unidos' },
        { codigo: 'MNX', nombre: 'Peso Mexicano' },
        { codigo: 'EUR', nombre: 'Euro' },
        { codigo: 'GBP', nombre: 'Libra Esterlina' }
    ]


    // Utilizar useMoneda
    const [moneda, SelectMonedas] = useMoneda('Elige tu moneda', '', MONEDAS);

    // Utilizar useCritomoneda
    const [critomoneda, SelecCripto] = useCritomoneda('Elige tu Criptomoneda', '', listacripto);

    // Ejecutar llamada a la API
    useEffect(() => {
        const consultarAPI = async () => {
            const url = 'https://min-api.cryptocompare.com/data/top/mktcapfull?limit=10&tsym=USD';

            const resultado = await axios.get(url);

            guardarCriptomonedas(resultado.data.Data);
        }

        consultarAPI();
    }, []);

    // Cuando el usuario hace submit
    const cotizarMoneda = e => {
        e.preventDefault();

        // Validar si ambos campos estan llenos 
        if (moneda === '' || critomoneda === '') {
            guardarError(true);
            return;
        }

        //Pasar los datos al componente principal
        guardarError(false);
        guardarMoneda(moneda);
        guardarCriptomoneda(critomoneda);
    }

    return (
        <form
            onSubmit={cotizarMoneda}
        >

            {error ? <Error mensaje="Todos los campos son obligatorios" /> : null}

            <SelectMonedas />

            <SelecCripto />

            <Boton
                type="submit"
                value="Calcular"
            />
        </form>
    );
}

export default Formulario;