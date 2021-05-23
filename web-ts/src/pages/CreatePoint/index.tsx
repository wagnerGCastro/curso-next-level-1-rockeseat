import React, { useState, useEffect, ChangeEvent } from 'react';
import { Link } from 'react-router-dom';
import { Map, TileLayer, Marker } from 'react-leaflet'
import { LeafletMouseEvent } from 'leaflet';
import { FiArrowLeft } from 'react-icons/fi';
import api from '../../services/api';
import axios from 'axios';

import logo from '../../assets/logo.svg';
import './styles.css';
// import 'leaflet/dist/leaflet.css'; // -- error base64

interface ItemProps {
  id: number,
  title: string,
  image_url: string
}

interface IBGERespProps {
  sigla: string
}

interface IBGERespCitysProps {
  nome: string
}

interface MarkedPositionProps {
  lat: number,
  lng: number
}

const CreatePoint: React.FC = () => {
  const [items, setItems] = useState<ItemProps[]>([]);
  const [ufs, setUfs] = useState<string[]>([]);
  const [citys, setCitys] = useState<string[]>([]);
  const [selectedUF, setSelectedUF] = useState<string>('0');
  const [selectedCity, setSelectedCity] = useState<string>('0');
  const [initialPosition, setInitialPosition] = useState<[number, number]>([0, 0]);
  const [selectedPosition, setSelectedPosition] = useState<[number, number]>([0, 0]);

  function handleMapClick(event: LeafletMouseEvent) {
    console.log(event.latlng);
    setSelectedPosition([ event.latlng.lat, event.latlng.lng]);
  }

  function handleSelectedUF(event: ChangeEvent<HTMLSelectElement>) {
    //console.log(event.target.value)
    setSelectedUF(event.target.value)
  }

  function handleSelectedCity(event: ChangeEvent<HTMLSelectElement>) {
    //console.log(event.target.value)
    setSelectedCity(event.target.value)
  }

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(position => {
      const { latitude, longitude } = position.coords;
      setInitialPosition([latitude, longitude])
      console.log('position', position)
    });
  }, []);

  useEffect(() => {
    api.get('items').then(resp => setItems(resp.data));
  }, []);

  useEffect(() => {
    axios.get<IBGERespProps[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados')
      .then(resp => {
        let ufsInitials = resp.data.map(uf => uf.sigla);
        //console.log(ufsInitials);
        setUfs(ufsInitials);
      });
  }, []);

  useEffect(() => {
    if(selectedUF !== '0') {
      axios.get<IBGERespCitysProps[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUF}/municipios`)
      .then(resp => {
        let citysArray = resp.data.map(city => city.nome);
        //console.log(resp.data);
        setCitys(citysArray);
      });
    }
  }, [selectedUF]);

  return (
    <div id="page-create-point">
      <header>
        <img src={logo} alt="Ecoleta" />
        <Link to="/">
          <FiArrowLeft />
          Voltar para home
        </Link>
      </header>

      <form>
        <h1>Cadastro do <br/> ponto de coleta</h1>

        <fieldset>
          <legend>
            <h2>Dados</h2>
          </legend>
          <div className="field">
            <label htmlFor="name">Nome da entidade</label>
            <input type="text" name="name" id="name"/>
          </div>

          <div className="field-group">
            <div className="field">
              <label htmlFor="email">Email</label>
              <input type="email" name="email" id="email"/>
            </div>
            <div className="field">
              <label htmlFor="whatsapp">Whatsapp</label>
              <input type="text" name="whatsapp" id="whatsapp"/>
            </div>
          </div>
        </fieldset>

        <fieldset>
          <legend>
            <h2>Endereço</h2>
            <span>Selecione o endereço no mapa</span>
          </legend>

          <Map center={initialPosition} zoom={15} scrollWheelZoom={false} onClick={handleMapClick}>
            <TileLayer
              attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={selectedPosition} />
          </Map>

          <div className="field-group">
            <div className="field">
              <label htmlFor="uf">Estado (UF)</label>
              <select
                name="uf"
                id="uf"
                value={selectedUF}
                onChange={handleSelectedUF}
              >
                <option value="0">Selecione uma UF</option>
                {ufs.map((uf, idx) => (
                  <option key={idx} value={uf}>{ uf }</option>
                ))}
              </select>
            </div>
            <div className="field">
              <label htmlFor="city">Cidade</label>

              <select
                name="city"
                id="city"
                value={selectedCity}
                onChange={handleSelectedCity}
              >
                <option>Selecione uma Cidade</option>
                {citys.map((city, idx) => (
                  <option key={idx} value={city}>{ city }</option>
                ))}
              </select>
            </div>
          </div>
        </fieldset>

        <fieldset>
          <legend>
            <h2>Intems de coleta</h2>
            <span>Selecione um ou mais ítens abaixo</span>
          </legend>

          <ul className="items-grid">
            {items.map((item, idx) => (
              <li key={idx} className="selected">
                <img src={ item.image_url } alt={item.title}/>
                <span>{ item.title }</span>
              </li>
            ))}
          </ul>
        </fieldset>

        <button type="submit">Cadastrar ponto de coleta</button>
      </form>
    </div>
  )
}

export default CreatePoint;
