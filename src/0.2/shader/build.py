import os.path
f=open('build.js','w')
for n in os.listdir('.'):
    #if n.endswith('.vert') or n.endswith('.frag'): 
    if n.endswith('.glsl'):
        s=open(n).read()
        s=s.replace('\n','\\n').replace('"','\\"')
        s=s.split('glsl-split')
        f.write('glsl_%s=["%s","%s"];\n'%(n[:-5],s[0],s[1]))
      #  f.write('glsl_%s_vert=["%s","%s"];\n'%(n[:-5],s[0],s[1]))
        #f.write('glsl_%s_frag="%s";\n'%(n[:-5],s[1]))
f.close()        
        
        