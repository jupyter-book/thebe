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
    `import numpy as np
import matplotlib.pyplot as plt
%matplotlib inline

from ipywidgets import interact, interactive
from IPython.display import clear_output, display, HTML

import numpy as np
from scipy import integrate

from matplotlib import pyplot as plt
from mpl_toolkits.mplot3d import Axes3D
from matplotlib.colors import cnames
from matplotlib import animation

def solve_lorenz(
  N=10, angle=0.0, max_time=4.0, 
  sigma=10.0, beta=8./3, rho=28.0):

    fig = plt.figure()
    ax = fig.add_axes([0, 0, 1, 1], projection='3d')
    ax.axis('off')

    # prepare the axes limits
    ax.set_xlim((-25, 25))
    ax.set_ylim((-35, 35))
    ax.set_zlim((5, 55))
    
    def lorenz_deriv(x_y_z, t0, sigma=sigma, beta=beta, rho=rho):
        """Compute the time-derivative of a Lorenz system."""
        x, y, z = x_y_z
        return [sigma * (y - x), x * (rho - z) - y, x * y - beta * z]

    # Choose random starting points, uniformly distributed from -15 to 15
    np.random.seed(1)
    x0 = -15 + 30 * np.random.random((N, 3))

    # Solve for the trajectories
    t = np.linspace(0, max_time, int(250*max_time))
    x_t = np.asarray([integrate.odeint(lorenz_deriv, x0i, t)
                      for x0i in x0])
    
    # choose a different color for each trajectory
    colors = plt.cm.viridis(np.linspace(0, 1, N))

    for i in range(N):
        x, y, z = x_t[i,:,:].T
        lines = ax.plot(x, y, z, '-', c=colors[i])
        plt.setp(lines, linewidth=2)

    ax.view_init(30, angle)
    plt.show()

    return t, x_t

w = interactive(solve_lorenz, angle=(0.,360.), max_time=(0.1, 4.0), 
                N=(0,50), sigma=(0.0,50.0), rho=(0.0,50.0))
display(w)`,
  ],
  ipywidgets_lite: [
    `%pip install ipywidgets ipympl

import numpy as np
import matplotlib.pyplot as plt
%matplotlib inline

from ipywidgets import interact, interactive
from IPython.display import clear_output, display, HTML

import numpy as np
from scipy import integrate

from matplotlib import pyplot as plt
from mpl_toolkits.mplot3d import Axes3D
from matplotlib.colors import cnames
from matplotlib import animation

def solve_lorenz(
  N=10, angle=0.0, max_time=4.0, 
  sigma=10.0, beta=8./3, rho=28.0):

    fig = plt.figure()
    ax = fig.add_axes([0, 0, 1, 1], projection='3d')
    ax.axis('off')

    # prepare the axes limits
    ax.set_xlim((-25, 25))
    ax.set_ylim((-35, 35))
    ax.set_zlim((5, 55))
    
    def lorenz_deriv(x_y_z, t0, sigma=sigma, beta=beta, rho=rho):
        """Compute the time-derivative of a Lorenz system."""
        x, y, z = x_y_z
        return [sigma * (y - x), x * (rho - z) - y, x * y - beta * z]

    # Choose random starting points, uniformly distributed from -15 to 15
    np.random.seed(1)
    x0 = -15 + 30 * np.random.random((N, 3))

    # Solve for the trajectories
    t = np.linspace(0, max_time, int(250*max_time))
    x_t = np.asarray([integrate.odeint(lorenz_deriv, x0i, t)
                      for x0i in x0])
    
    # choose a different color for each trajectory
    colors = plt.cm.viridis(np.linspace(0, 1, N))

    for i in range(N):
        x, y, z = x_t[i,:,:].T
        lines = ax.plot(x, y, z, '-', c=colors[i])
        plt.setp(lines, linewidth=2)

    ax.view_init(30, angle)
    plt.show()

    return t, x_t

w = interactive(solve_lorenz, angle=(0.,360.), max_time=(0.1, 4.0), 
                N=(0,50), sigma=(0.0,50.0), rho=(0.0,50.0))
display(w)`,
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
  ipyleaflet_lite: [
    `%pip install ipyleaflet
    
from ipyleaflet import Map
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
      repo: 'executablebooks/thebe-binder-base',
      ref: 'HEAD',
    },
  },
};
