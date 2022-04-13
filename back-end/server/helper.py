import pandas as pd 
import numpy as np
import networkx as nx
from networkx.readwrite import json_graph
from scipy.sparse import csr_matrix
from scipy.sparse.csgraph import minimum_spanning_tree
import json


def load_clean_data(path_):
    df = pd.read_parquet(path_)
    print("shape before:", df.shape)
    df_clean = df.iloc[:,:50]
    df_clean = df_clean.dropna(axis=0)
    print("shape after:", df_clean.shape)
    print("NaN value present ? ",df_clean.isnull().sum().any())
    return df_clean


def get_correlation(df_, from_, to_):
    correlation_df = df_.iloc[from_:to_, :].corr()
    return correlation_df


def get_distance(df_):
    dist = (2*(1- df_))**(1/2)
    return dist


def get_distance_threshold(df_, percentage_keep_):
    sort_val = np.sort(df_.values.flatten())
    th = sort_val[int((sort_val.shape[0]-df_.shape[0])*percentage_keep_)+df_.shape[0]] #don't consider diagonal element
    return th


def generate_dict_PHY(df_, sector_, percentage_keep_):
        
    th = get_distance_threshold(df_, percentage_keep_)

    #create graph
    G = nx.from_pandas_adjacency(df_)
    graph_dict = json_graph.node_link_data(G)
    del graph_dict['directed']
    del graph_dict['multigraph']
    del graph_dict['graph']
    
    final_dict = dict()
    ids = dict()

    #nodes
    list_nodes = []
    for idx, elm in enumerate(graph_dict['nodes']):
        list_nodes.append(dict({'data': dict({'id': str(idx), 'label': elm['id'],'sector': sector_[elm['id']]})}))
        ids[elm['id']] = str(idx)
    final_dict.update(dict({'nodes':list_nodes}))
    

    #edges
    list_edges = []
    for idx, elm in enumerate(graph_dict['links']):
        if elm['weight'] < th:
            list_edges.append(dict({'data': dict(
                {'id': 'link_'+str(idx),
                 'source': ids[elm['source']],
                 'target': ids[elm['target']],
                 'value': elm['weight'],
                 })}))     
    final_dict.update(dict({'edges':list_edges}))
    return final_dict

def generate_dict_MST(df_, sector_):
    
    X = csr_matrix(df_.values)


    Tcsr = minimum_spanning_tree(X)
    df_ = pd.DataFrame( Tcsr.toarray(),index=df_.index, columns=df_.columns)

    #create graph
    G = nx.from_pandas_adjacency(df_)
    graph_dict = json_graph.node_link_data(G)
    del graph_dict['directed']
    del graph_dict['multigraph']
    del graph_dict['graph']
    
    final_dict = dict()
    ids = dict()

    #nodes
    list_nodes = []
    for idx, elm in enumerate(graph_dict['nodes']):
        list_nodes.append(dict({'data': dict({'id': str(idx), 'label': elm['id'],'sector': sector_[elm['id']]})}))
        ids[elm['id']] = str(idx)
    final_dict.update(dict({'nodes':list_nodes}))
    

    #edges
    list_edges = []
    for idx, elm in enumerate(graph_dict['links']):
        if True:
            list_edges.append(dict({'data': dict(
                {'id': 'link_'+str(idx),
                 'source': ids[elm['source']],
                 'target': ids[elm['target']],
                 'value': elm['weight'],
                 })}))     
    final_dict.update(dict({'edges':list_edges}))
    return final_dict

def save_json_rolling(df_, sectors_,
                      start_=1000,
                      end_=None,
                      rolling_window_=1000,
                      step_=100,
                      percentage_keep_=0.6):
    
    if end_ == None:
        end_ = df_.shape[0]
        
    if end_ > df_.shape[0]: 
        print("end_ parameter  to large ")
        return 0
    
    if start_ < rolling_window_: 
        print("start_ parameter need to be larger then rolling_window_")
        return 0
    
    if percentage_keep_ > 1 or percentage_keep_ <= 0:
        print("percentage_keep_ parameter need to be between [0, 1]")
        return 0
    
    list_dict = []
    for i in range(start_,end_, step_):
        c_df = get_correlation(df_, i-rolling_window_,i) # !! if interval to small result in nan value
        d_df = get_distance(c_df)
   
        # MST or PHY ?? TODO
        final_dict = generate_dict_MST(d_df, sectors_)
        #final_dict = generate_dict_PHY(d_df, sectors_, percentage_keep_)
            
        list_dict.append(final_dict)
        
    return list_dict



