import type { Server as HTTPServer } from 'http'
import type { NextApiRequest, NextApiResponse } from 'next'
import type { Socket as NetSocket } from 'net'
import { Server as IOServer } from 'socket.io'
import Pawn from '../../models/Pawn';

interface SocketServer extends HTTPServer {
  io?: IOServer | undefined;
}

interface SocketWithIO extends NetSocket {
  server: SocketServer;
}

interface NextApiResponseWithSocket extends NextApiResponse {
  socket: SocketWithIO;
}

const SocketHandler = (_: NextApiRequest, res: NextApiResponseWithSocket) => {
  if (res.socket.server.io) {
    console.log('Socket is already running');
  } else {
    console.log('Socket is initializing');

    const io = new IOServer(res.socket.server);

    res.socket.server.io = io;

    io.on('connection', socket => {
      socket.on('wheelSpin', ({
        pawn,
        steps
      }) => {
        const movePawn = async (pawn: Pawn, steps: number, traveled = 0, lap = false): Promise<void> => {
          await new Promise(resolve => setTimeout(resolve, 250));
        
          traveled++;
        
          const { space } = pawn;
          const start = lap ? 0 : space;
        
          let destination = start + steps;
          let next = start + traveled;
        
          if (next === 40) {
            steps = destination = destination - 40;
            next = 0;
            traveled = 0;
        
            lap = true;
        
            socket.broadcast.emit('handleLap', pawn);
          }

          const moving = pawn.moving = next !== destination;
        
          socket.broadcast.emit('movePawn', pawn, next);
        
          if (moving) {
            return movePawn(pawn, steps, traveled, lap);
          }
          
          socket.broadcast.emit('handleArrival', { pawn, destination });
        }

        movePawn(pawn, steps);
      })
    });
  }

  res.end();
}

export default SocketHandler;