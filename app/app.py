import os

from fastapi import FastAPI, File, HTTPException, Request, UploadFile, WebSocket
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import Response, StreamingResponse
from fastapi.staticfiles import StaticFiles
from uvicorn import run
from weather import get_real_time_weather, predict_disruption

# App creation
app = FastAPI()

origins = ["*"]
methods = ["*"]
headers = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=methods,
    allow_headers=headers
)

@app.get("/weather/{location}")
async def get_weather(location: str):

    # Get real-time weather data
    weather_data = get_real_time_weather("7663a20f0f0547a999495235241707", location)
    #print(f"weather_data: {weather_data}")

    temperature = weather_data['current']['temp_c']
    wind_speed = weather_data['current']['wind_kph']
    precipitation = weather_data['current']['precip_mm']
    condition = weather_data['current']['condition']['text']
    imageUrl = weather_data['current']['condition']['icon']

    weather_data_string = f"Temperature: {temperature}°C, Wind Speed: {wind_speed}kph, Precipitation: {precipitation}mm, Condition: {condition}"

    if not weather_data:
        raise HTTPException(status_code=404, detail=f"Weather data not found for {location}")

    flight_disruption_prediction = predict_disruption(weather_data)
    # print(f"flight_disruption_prediction: {flight_disruption_prediction}")

    return {
        "weather_data": weather_data_string,
        "flight_disruption_prediction": flight_disruption_prediction,
        "image_url": imageUrl
    }

# Launch the FastAPI server
if __name__ == "__main__":
    port = int(os.getenv('PORT', '5000'))
    run(app, host="0.0.0.0", port=port)
