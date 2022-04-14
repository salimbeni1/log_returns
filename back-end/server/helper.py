import pandas as pd 
import numpy as np
import networkx as nx
from networkx.readwrite import json_graph
from scipy.sparse import csr_matrix
from scipy.sparse.csgraph import minimum_spanning_tree
import json


def pd_fill_diagonal(df_, value=0): 
    mat = df_.values
    n = mat.shape[0]
    mat[range(n), range(n)] = value
    return pd.DataFrame(mat, index=df_.index, columns=df_.columns)

def norm_data(df_):
    df_ = pd_fill_diagonal(df_, value=df_.mean().mean())
    
    X_std = (df_ - df_.min().min()) / (df_.max().max() - df_.min().min())
    X_scaled = X_std * (2 - 1) + 1

    X_std = pd_fill_diagonal(X_scaled)
    return X_std


def get_distance(df_):
    dist = (2*(1- df_))**(1/2)
    return dist

def get_correlation(df_, from_, to_):
    df_clean = df_.iloc[from_:to_, :]
    df_clean = df_clean.dropna(axis=1) 
    correlation_df = df_clean.corr()
    if correlation_df.isnull().values.sum() > 0:
        print("!!!!!!!!!!", from_, to_, correlation_df.isnull().sum())
    return correlation_df

def get_distance_threshold(df_, percentage_keep_):
    sort_val = np.sort(df_.values.flatten())
    th = sort_val[int((sort_val.shape[0]-df_.shape[0])*percentage_keep_)+df_.shape[0]-1] #don't consider diagonal element
    return th

def generate_dict_MST(df_, sectors_, DICT_IDX):

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
        list_nodes.append(dict({'data': dict({'id': str(DICT_IDX[elm['id']]), 'label': elm['id'], 'sector': sectors_[elm['id']]})}))
    final_dict.update(dict({'nodes':list_nodes}))
    

    #edges
    list_edges = []
    for idx, elm in enumerate(graph_dict['links']):
        list_edges.append(dict({'data': dict(
                    {'id': 'link_'+str(idx),
                     'source': str(DICT_IDX[elm['source']]),
                     'target':str(DICT_IDX[elm['target']]),
                     'value': elm['weight']})}))     
    final_dict.update(dict({'edges':list_edges}))
    return final_dict
    

def generate_dict_PHY(df_, sectors_, DICT_IDX):

    th = get_distance_threshold(df_, percentage_keep_=0.05)
    
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
        list_nodes.append(dict({'data': dict({'id': str(DICT_IDX[elm['id']]), 'label': elm['id'], 'sector': sectors_[elm['id']]})}))
    final_dict.update(dict({'nodes':list_nodes}))
    

    #edges
    list_edges = []
    for idx, elm in enumerate(graph_dict['links']):
        if  elm['weight'] < th:
            list_edges.append(dict({'data': dict(
                    {'id': 'link_'+str(idx),
                     'source': str(DICT_IDX[elm['source']]),
                     'target':str(DICT_IDX[elm['target']]),
                     'value': elm['weight']})}))     
    final_dict.update(dict({'edges':list_edges}))
    return final_dict


def get_rolling_dict(sectors_, df_, start_, stop_, step_, type_='MST'):
    
    dict_ = []
    DICT_IDX = {k: v for v, k in enumerate(sectors_)}
    
    if (type_ == 'MST'):
        for i in range(start_, stop_, step_):
            dict_.append(generate_dict_MST(get_distance(get_correlation(df_, i-1000, i)), sectors_, DICT_IDX))
    elif (type_ == 'PHY'):
        for i in range(start_, stop_, step_):
            dict_.append(generate_dict_PHY(get_distance(get_correlation(df_, i-1000, i)), sectors_, DICT_IDX))
    else:
        print("ERROR ON TYPE MST/PHY")

    return dict_



