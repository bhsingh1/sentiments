import requests
import openai

# Set your OpenAI API key
openai.api_key = ''

def get_real_time_weather(api_key, location):
    url = f'http://api.weatherapi.com/v1/current.json?key={api_key}&q={location}'
    response = requests.get(url)
    if response.status_code == 200:
        weather_data = response.json()
        return weather_data
    else:
        print(f"Error fetching weather data: {response.status_code}")
        return None

# Function to predict flight disruption
def predict_disruption(weather_data):
    if weather_data:
        text_prediction = analyze_weather_data(weather_data)
        #print(f"text_prediction: {text_prediction}")
        return text_prediction
    else:
        return "No weather data available to make prediction"

# Function to analyze weather data data using GPT-4
def analyze_weather_data(text):
    response = openai.ChatCompletion.create(
        model="gpt-4",
        messages=[
            {"role": "system", "content": "You are an assistant that predicts potential flight disruptions."},
            {"role": "user", "content": f"Analyze the following text and predict if it indicates a potential flight disruption. provide answer in yes or no followed by prediction summary. {text}"}
        ],
        max_tokens=500
    )
    return response.choices[0].message['content'].strip()
