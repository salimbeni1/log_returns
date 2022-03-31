import fastapi
import uvicorn

app = fastapi.FastAPI()

@app.get('/')
def index():
    return {
        "message" : "Hello mec!"
    }
    
@app.get('/api/{num}')
def api(num: int):
    return {
       'PAGE NUMBER {num}'
    }
    
if __name__ == '__main__':
    uvicorn.run(app)
    
    