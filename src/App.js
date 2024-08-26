/* eslint-disable jsx-a11y/img-redundant-alt */
import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Form, Button, Container, Row, Col, Spinner } from "react-bootstrap";
import axios from "axios";
import "./App.css";

const App = () => {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [image, setImage] = useState(null);
  const [description, setDescription] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getLocation = async () => {
      const location = await axios.get("http://ip-api.com/json");
      const { lat, lon } = location.data;
      const weather = await axios.get(
        `http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=ce496a1edaf9f933742ece6ea52aad64&units=metric`
      );
      setWeather(weather.data);
      const image = await axios.get(
        `https://api.unsplash.com/search/photos?query=${weather.data.name}&client_id=nIcfKA-9A7lphsawDilSIjAHWeS_Un1QzxTV3p3_HKU`
      );
      setImage(image.data.results[0].urls.small);
      const description = await axios.get(
        `https://en.wikipedia.org/api/rest_v1/page/summary/${weather.data.name}`
      );
      setDescription(description.data.extract);
    };
    getLocation();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const weather = await axios.get(
        `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=ce496a1edaf9f933742ece6ea52aad64&units=metric`
      );
      setWeather(weather.data);
      const image = await axios.get(
        `https://api.unsplash.com/search/photos?query=${city}&client_id=nIcfKA-9A7lphsawDilSIjAHWeS_Un1QzxTV3p3_HKU`
      );
      setImage(image.data.results[0].urls.small);
      const description = await axios.get(
        `https://en.wikipedia.org/api/rest_v1/page/summary/${city}`
      );
      setDescription(description.data.extract);
    } catch (err) {
      setError("City not found. Please enter a valid city name.");
    }
    setLoading(false);
  };

  return (
    <Container className="mt-5">
      <Row>
        <Col xs={12} md={12}>
          <h1 className="text-center">
            <img className="logo-image" src={"/logo192.png"} alt="Logo Image" />
            &nbsp;Weather App Project
          </h1>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formBasicEmail">
              <Form.Label>
                <b>Enter city name</b>
              </Form.Label>
              <Row>
                <Col xs={12} md={10}>
                  <Form.Control
                    type="text"
                    placeholder="City Name"
                    onChange={(e) => setCity(e.target.value)}
                  />
                </Col>
                <Col xs={12} md={2}>
                  <Button variant="primary" type="Click">
                    Submit
                  </Button>
                </Col>
              </Row>
            </Form.Group>
          </Form>
        </Col>
        <hr/>
        <Col xs={12} md={12}>
          {loading ? (
            <Spinner animation="border" role="status">
              <span className="sr-only">Loading...</span>
            </Spinner>
          ) : error ? (
            <Col md={6} className="text-danger">
              {error}
            </Col>
          ) : (
            weather && (
              <div className="weather-section">
                <h2 className="text-center">
                  <b>Weather in {weather.name}</b>
                </h2>
                <br />
                <Row>
                  <Col xs={12} md={4} className="city-image">
                    <img src={image} alt={weather.name} />
                  </Col>
                  <Col xs={12} md={8}>
                    <p>{description}</p>
                  </Col>
                </Row>

                <p className="summary">
                  Temperature: {weather.main.temp}°C | Humidity:{" "}
                  {weather.main.humidity}% | Wind speed: {weather.wind.speed}m/s
                </p>
              </div>
            )
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default App;
