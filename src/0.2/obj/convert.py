import sys
for n in sys.argv[1:]: 
    name = 'obj'
    v = []
    vt = []
    vn = []
    f = []
    vertice_size = 3
    normal_size = 3
    texCoord_size = 3
    
    for s in open(n).readlines():  
        l = s.split()
        if '#name' == l[0]:
            name = l[1]
        elif 'v' == l[0]:
            v.extend(l[1:])
            vertice_size = len(l) - 1
        elif 'vt' == l[0]:
            vt.extend(l[1:])
            texCoord_size = len(l) - 1
        elif 'vn' == l[0]:
            vn.extend(l[1:])
            normal_size = len(l) - 1
        elif 'f' == l[0]:
            f.extend(l[1:])
    v = [float(i) for i in v]
    vt = [float(i) for i in vt]
    vn = [float(i) for i in vn]        
    counter = 0   
    vertices = []
    normals = []
    texCoords = []
    indices = []             
    for point in f:
        
        point = [int(i) for i in point.split('/')]
        i = point[0]-1
        vertices.extend(v[i * vertice_size:(i + 1) * vertice_size])
        i = point[1]-1
        normals.extend(vn[i * normal_size:(i + 1) * normal_size])
        i = point[2]-1
        texCoords.extend(vt[i * texCoord_size:(i + 1) * texCoord_size])
        indices.append(counter)
        
        counter += 1
    print("""var MESH_%(name)s={
        position:{
            data: new Float32Array(%(vertices)s), 
            size: %(vertice_size)d, 
            buffer: null, 
            target: null 
        },
        normal:{
            data: new Float32Array(%(normals)s), 
            size: %(normal_size)d, 
            buffer: null, 
            target: null 
        },
        texCoord:{
            data: new Float32Array(%(texCoords)s), 
            size: %(texCoord_size)d, 
            buffer: null, 
            target: null 
        }, 
        indice: {
            data:new Uint16Array(%(indices)s),
            buffer:null
        }
    };
    
    
    """ % {'name':name, 'vertices':vertices, 'normals':normals,
         'texCoords':texCoords, 'vertice_size':vertice_size, 'normal_size':normal_size, 'texCoord_size':texCoord_size, 'indices':indices
        })        
