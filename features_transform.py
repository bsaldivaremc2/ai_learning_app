import os
import json
import random
import tensorflow as tf
from tqdm import tqdm
import numpy as np
import struct

def decrease_array_size():
    # 1 is dog, 0 is cat
    with open('/home/ymartins/Documents/kagglecatsanddogs_5340/features_catsxdogs.json','r') as f:
        d = json.load(f)
    m = { 'x': [], 'y': [], 'class': [] }
    m['x'] = d['x'][:200] + d['x'][600:800]
    m['class'] = d['y'][:200] + d['y'][600:800]
    m['y'] = [1]*200 + [0]*200
    with open( '100_features_catsxdogs.json', 'w' ) as g:
        json.dump(m, g)

    
    with open('/home/ymartins/Documents/kagglecatsanddogs_5340/features_digits.json','r') as f:
        d = json.load(f)
    i = 0
    cl = {}
    for el in d['y_train']:
        x = d['x_train'][i]
        if( not str(el) in cl ):
                cl[ str(el) ] = []
        if( len( cl[ str(el) ] ) < 200 ):
                cl[ str(el) ].append(x)
        i+=1
        
    names = ['Zero', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine']
    n = { 'x': [], 'y': [], 'class': [] }
    for k in cl.keys():
        nk = len( cl[k] )
        n['x'] += cl[k]
        n['y'] += [ int(k) ]*nk
        n['class'] += [ names[ int(k) ] ]*nk
    with open( '100_features_digits.json', 'w' ) as g:
        json.dump(n, g)

def _read_mnist_images(filename):
    with open(filename, 'rb') as file:
        magic, num, rows, cols = struct.unpack(">IIII", file.read(16))
        images = np.fromfile(file, dtype=np.uint8).reshape(num, rows, cols)
    return images

def _read_mnist_labels(file_path):
    with open(file_path, 'rb') as file:
        magic_number, num_labels = struct.unpack(">II", file.read(8))
        labels = np.fromfile(file, dtype=np.uint8)
    return labels

def transform_ds_mnist():
    print('Preparing digits dataset ...')    
    
    path = '/home/ymartins/Documents'
    train_images = _read_mnist_images( f'{path}/mnist-dataset/train-images.idx3-ubyte')
    train_labels = _read_mnist_labels( f'{path}/mnist-dataset/train-labels.idx1-ubyte')
    test_images = _read_mnist_images( f'{path}/mnist-dataset/t10k-images.idx3-ubyte')
    test_labels = _read_mnist_labels( f'{path}/mnist-dataset/t10k-labels.idx1-ubyte')
    
    train_images = train_images.astype('float32') / 255
    test_images = test_images.astype('float32') / 255
    
    dt = { 'x_train': train_images.tolist(), 'x_test': test_images.tolist(), 'y_train': train_labels.tolist(), 'y_test': test_labels.tolist() }
    
    with open('/home/ymartins/Documents/kagglecatsanddogs_5340/features_digits.json', 'w') as f:
        json.dump(dt, f)
        
def transform_ds_catsDogs():
    print('Preparing cats x dogs dataset ...')
    
    dt = { 'x': [], 'y': [] }

    path = '/home/ymartins/Documents/kagglecatsanddogs_5340/PetImages'
    nmax = 600
    img_width = 100
    img_height = 100
    classes = os.listdir(path)
    for c in classes:
        cls = c.lower()
        impath = f"{path}/{c}"
        imgs = os.listdir(impath)
        sample = random.sample(imgs, nmax)
        n=0
        for im in tqdm(sample):
            #if ( n < nmax ):
            try:
                img = tf.keras.utils.load_img( f"{impath}/{im}", target_size=(img_height, img_width) )
                arr = tf.keras.utils.img_to_array( img )
                dt['x'].append( arr.tolist() )
                dt['y'].append(cls)
                dt['chosen'].append(im)
            except:
                pass
            n+=1

    with open('/home/ymartins/Documents/kagglecatsanddogs_5340/features_catsxdogs.json', 'w') as f:
        json.dump(dt, f)

    batch_size = 32
    train_ds = tf.keras.utils.image_dataset_from_directory(
      path,
      validation_split=0.2,
      subset="training",
      seed=123,
      image_size=(img_height, img_width),
      batch_size=batch_size)

    for image_batch, labels_batch in train_ds:
        print(image_batch.shape)
        print(labels_batch.shape)
        break

transform_ds_catsDogs()
#transform_ds_mnist()
decrease_array_size()

