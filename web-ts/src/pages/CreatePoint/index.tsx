import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { Link, useHistory } from 'react-router-dom';
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

const CreatePoint: React.FC = () => {
  const [items, setItems] = useState<ItemProps[]>([]);
  const [ufs, setUfs] = useState<string[]>([]);
  const [citys, setCitys] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    whatsapp: ''
  });
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [selectedUF, setSelectedUF] = useState<string>('0');
  const [selectedCity, setSelectedCity] = useState<string>('0');
  const [initialPosition, setInitialPosition] = useState<[number, number]>([0, 0]);
  const [selectedPosition, setSelectedPosition] = useState<[number, number]>([0, 0]);

  const history = useHistory();

  function handleMapClick(event: LeafletMouseEvent) {
    //console.log(event.latlng);
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

  function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
    //console.log(event.target.name, event.target.value);
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value })
    // setSelectedCity(event.target.value)
  }

  function handleSelectItem(id: number) {
    //console.log('item', id)
    const alreadySelected = selectedItems.findIndex((item => item === id));

    if(alreadySelected >= 0) {
      // Remove
      const filteredItems = selectedItems.filter((item => item !== id));
      setSelectedItems(filteredItems);
    } else {
      // add
      setSelectedItems([ ...selectedItems, id ])
    }
  }

  async function handleSubmit(event: FormEvent ) {
    event.preventDefault();
    const { name , email, whatsapp } = formData;
    const uf = selectedUF;
    const city = selectedCity;
    const [latitude, longitude ] = selectedPosition;
    const items = selectedItems;

    const data = {
      name,
      email,
      whatsapp,
      uf,
      city,
      latitude,
      longitude,
      items
    }

    console.log('FomrData', data);
    await api.post('points', data);
    alert('Ponto de coleta Criado!');
    history.push('/');
  }

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(position => {
      const { latitude, longitude } = position.coords;
      setInitialPosition([latitude, longitude])
      //console.log('position', position)
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

      <form onSubmit={handleSubmit}>
        <h1>Cadastro do <br/> ponto de coleta</h1>

        <fieldset>
          <legend>
            <h2>Dados</h2>
          </legend>
          <div className="field">
            <label htmlFor="name">Nome da entidade</label>
            <input type="text" name="name" id="name" onChange={handleInputChange}/>
          </div>

          <div className="field-group">
            <div className="field">
              <label htmlFor="email">Email</label>
              <input type="email" name="email" id="email" onChange={handleInputChange}/>
            </div>
            <div className="field">
              <label htmlFor="whatsapp">Whatsapp</label>
              <input type="text" name="whatsapp" id="whatsapp" onChange={handleInputChange}/>
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
              <li
                key={idx}
                className={selectedItems.includes(item.id) ? 'selected' : ''}
                onClick={() => {handleSelectItem(item.id)}}
              >
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
