import fastapi
import uvicorn
import helper

app = fastapi.FastAPI()

@app.get('/')
def index():
    df = helper.load_clean_data('/code/DATA/us_equities_logreturns.parquet')
    c_df = helper.get_correlation(df, 0,1000) # !! if interval to small result in nan value
    d_df = helper.get_distance(c_df)
    final_dict = helper.generate_dict(d_df, percentage_keep_=0.3)
       
    return final_dict
'''{
        "message" : "Hello mec!"
    }
    '''
    
@app.get('/api/{num}')
def api(num: int):
    return {
       'PAGE NUMBER {num}'
    }
    
if __name__ == '__main__':
    uvicorn.run(app)
    
    