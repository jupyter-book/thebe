export const code = {
  basic: [
    `
%matplotlib inline
import numpy as np
import matplotlib.pyplot as plt`,
    `fs = 1
phi = np.pi/5`,
    `plt.ion()
fig, ax = plt.subplots()
x = np.arange(-np.pi/2,np.pi/2,0.01)
y = np.cos(2*np.pi*fs*x+phi)
yy = np.sin(2*np.pi*fs*x+phi)
ax.plot(x,y);
ax.plot(x,yy);
plt.grid(True)`,
  ],
  ipywidgets: [
    `%matplotlib widget
import ipywidgets as widgets
import matplotlib.pyplot as plt
import numpy as np      
from ipywidgets import Output, FloatSlider, Layout
from IPython.display import clear_output
w_output = Output(layout=Layout(border="1px solid blue"))

x = np.linspace(0,10, 100)
w = 1.3
amp = 1.0

w_w = FloatSlider(min=0.1, max=5.0, step=0.05, value=0.8, description="W")
w_a = FloatSlider(min=0.1, max=3.0, step=0.1, value=1.0, description="Amplitude")

props = dict(
    linewidth=1
)

#plt.ioff()
fig_two, ax_two = plt.subplots(1,1)
#plt.ion()

with w_output:
    display(fig_two.canvas)
    
def on_pick(evt):
    print(evt)
    props["linewidth"] = props["linewidth"] + 1
    redraw_plot({})
    
cid = fig_two.canvas.mpl_connect('pick_event', on_pick)
    
def sine_func(x, w, amp):
  return amp*np.sin(w*x)

def redraw_plot(evt):
    with w_output:
        ax_two.cla()
        ax_two.set_ylim(-4, 4)
        ax_two.plot(x, sine_func(x, w_w.value, w_a.value), **props, picker=True)
        clear_output()

redraw_plot({})

w_w.observe(redraw_plot, names=["value"])
w_a.observe(redraw_plot, names=["value"])

print("")
print("Move the sliders to change the waveform")
print("Click on the waverform to increase the linewidth.")
display(w_w)
display(w_a)`,
  ],
  ipyleaflet: [
    `from ipyleaflet import Map
from ipywidgets import Layout
# Collect common parameters
zoom = 8
place = None

# Create ipyleaflet tile layer from that server

places = dict(
    orotava=dict(center=(28.389216, -16.520283), zoom=12),
    pico_tiede=dict(center=(28.272401, -16.642457), zoom=12),
    santa_cruz=dict(center=(28.466965, -16.249938), zoom=12)
)

center = places[place]["center"] if place is not None else (28.586850, -15.648742)
zoom = places[place]["zoom"] if place is not None else zoom

# Create ipyleaflet map, add layers, add controls, and display
m = Map(center=center, zoom=zoom, layout=Layout( height='800px'))
m`,
  ],
  tqdm: [
    `from tqdm.auto import tqdm
from time import sleep

for i in tqdm(range(100)):
    sleep(0.05)`,
  ],
};

export const options = {
  lite: {
    requestKernel: true,
    kernelOptions: {
      name: 'python',
      kernelName: 'python',
    },
  },
  local: {
    kernelOptions: {
      name: 'python3',
      serverSettings: {
        appendToken: true,
        baseUrl: 'http://localhost:8888',
        token: 'test-secret',
      },
    },
  },
  binder: {
    binderOptions: {
      repo: 'stevejpurves/ipympl-binder-base',
      ref: 'main',
      binderUrl: 'https://mybinder.org',
    },
  },
};
