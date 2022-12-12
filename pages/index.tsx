import Head from 'next/head';
import { useState } from 'react';

import styles from '../styles/index.module.css';

import { useEffect } from 'react'
import { io, Socket } from "socket.io-client";

import Pawn from '../models/Pawn';
import User from '../models/User';
import Space, {
  Start,
  Building,
  Enterprise,
  Event,
  Taxes,
  Payment,
  Prison,
  Vacation,
  Arrestment,
} from '../models/Spaces';

let socket!: Socket;

export default function Home(props: { pawns: { [key: string]: Pawn}, spaces: any[] }) {
  useEffect(() => { socketInitializer() }, [])

  const socketInitializer = async () => {
    await fetch('/api/socket');
    socket = io();

    socket.on('connect', () => {
      console.log('connected');
    });

    socket.on('movePawn', (pawn: Pawn, destination) => {
      movePawn(pawn, destination);
    });

    socket.on('handleLap', pawn => {
      handleLap(pawn);
    });

    socket.on('handleArrival', ({pawn, destination}) => {
      handleArrival(pawn, destination);
    });
  }

  
  const spaces: Space[] = props.spaces.map(space => {
    if (space.type === 'Start') return new Start();
    
    if (space.type === 'Building') return new Building({...space});
    
    if (space.type === 'Enterprise') return new Enterprise({...space});
    
    if (space.type === 'Event') return new Event({...space});
    
    if (space.type === 'Taxes') return new Taxes({...space});
    
    if (space.type === 'Payment') return new Payment({...space});

    if (space.type === 'Prison') return new Prison();
    
    if (space.type === 'Vacation') return  new Vacation();

    return new Arrestment();
  });

  const [pawns, setPawns] = useState(props.pawns);
  const [moving, setMoving] = useState(false);

  const user = new User(pawns.black);

  const handleBuilding = (pawn: Pawn, space: Building) => {
    console.log('pawn:', pawn);
    console.log('space:', space);
  }

  const handleEnterprise = (pawn: Pawn, space: Enterprise) => {
    console.log('pawn:', pawn);
    console.log('space:', space);
  }
  
  const handleEvent = (pawn: Pawn, space: Event) => {
    console.log('pawn:', pawn);
    console.log('space:', space);
  }
  
  const handleTaxes = (pawn: Pawn, space: Taxes) => {
    console.log('pawn:', pawn);
    console.log('space:', space);
  }
  
  const handlePayment = (pawn: Pawn, space: Payment) => {
    console.log('pawn:', pawn);
    console.log('space:', space);
  }
  
  const handlePrison = (pawn: Pawn, space: Prison) => {
    console.log('pawn:', pawn);
    console.log('space:', space);
  }
  
  const handleVacation = (pawn: Pawn, space: Vacation) => {
    console.log('pawn:', pawn);
    console.log('space:', space);
  }

  const handleArrestment = (pawn: Pawn, space: Arrestment) => {
    console.log('pawn:', pawn);
    console.log('space:', space);
  }

  const handleLap = (pawn: Pawn) => {
    console.log('pawn:', pawn);
  }

  const handleArrival = (pawn: Pawn, destination: number) => {
    setMoving(false);

    const space: Space = spaces[destination];
    
    if (space instanceof Building) return handleBuilding(pawn, space);
    
    if (space instanceof Enterprise) return handleEnterprise(pawn, space);

    if (space instanceof Event) return handleEvent(pawn, space);

    if (space instanceof Taxes) return handleTaxes(pawn, space);
    
    if (space instanceof Payment) return handlePayment(pawn, space);

    if (space instanceof Prison) return handlePrison(pawn, space);

    if (space instanceof Vacation) return handleVacation(pawn, space);
    
    if (space instanceof Arrestment) return handleArrestment(pawn, space);
  }

  const movePawn = (pawn: Pawn, destination: number) => {
    setPawns({...pawns, [pawn.color]: {...pawn, space: destination}});
  }

  const [point, setPoint] = useState(12);
  const [spinning, setSpinning] = useState(false);

  const spinWheel = async (pawn: Pawn) => {
    setMoving(true);
    setSpinning(true);

    const number = Math.round(Math.random() * 11) + 1;
    
    setTimeout(() => {
      setPoint(number);
    }, 500);

    setTimeout(() => {
      setSpinning(false);
    },  1250);
    
    setTimeout(() => {
      console.log('steps: ', number);

      socket.emit('wheelSpin', {
        pawn,
        steps: number
      });
    }, 4000);
  }

  return (
    <>
      <Head>
        <title>Barco Imobiliário</title>
        <meta name="description" content="Jogo de tabuleiro criado com NEXT.js" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <main className={styles.main}>
        <button
          data-moving={moving}
          data-spinning={spinning}
          className={styles.compass}
          onClick={() => spinWheel(pawns[user.pawn.color])}
        >
          <i className={styles.pointer} style={{ "--point": point } as React.CSSProperties}>Rolar</i>
        </button>
        <div className={styles.pawns}>
          {
            Object.values(pawns).map((pawn, key) => (
              <p key={key} data-moving={pawn.moving} data-space={pawn.space} className={`${styles.pawn} ${styles[pawn.color]}`}>P</p>
            ))
          }
        </div>
        <div className={styles.board}>
          <div className={styles.top}>
            {
              spaces.slice(0, 10).map((space, key) => {
                return (
                  <section key={key} id={`${space.id}`} title={space.name}>
                    <h2>{space.id}</h2>
                  </section>
                );
              })
            }
          </div>
          <div className={styles.right}>
            {
              spaces.slice(10, 20).map((space, key) => {
                return (
                  <section key={key} id={`${space.id}`} title={space.name}>
                    <h2>{space.id}</h2>
                  </section>
                );
              })
            }
          </div>
          <div className={styles.bottom}>
            {
              spaces.slice(20, 30).map((space, key) => {
                return (
                  <section key={key} id={`${space.id}`} title={space.name}>
                    <h2>{space.id}</h2>
                  </section>
                );
              })
            }
          </div>
          <div className={styles.left}>
            {
              spaces.slice(30, 40).map((space, key) => {
                return (
                  <section key={key} id={`${space.id}`} title={space.name}>
                    <h2>{space.id}</h2>
                  </section>
                );
              })
            }
          </div>
        </div>
      </main>
    </>
  );
}

export async function getServerSideProps() {
  const pawns: { [key: string]: Pawn } =
  {
    'black': {
      color: 'black',
      space: 0,
      moving: false,
    },
    'red': {
      color: 'red',
      space: 0,
      moving: false,
    },
    'green': {
      color: 'green',
      space: 0,
      moving: false,
    },
    'blue': {
      color: 'blue',
      space: 0,
      moving: false,
    },
    'yellow': {
      color: 'yellow',
      space: 0,
      moving: false,
    },
    'white': {
      color: 'white',
      space: 0,
      moving: false,
    },
  };

  const spaces: Space[] = Array(40).fill(null).map((value, index) => {

    if (index === 0) {
      return new Start();
    }
    
    if (index === 10) {
      return new Prison();
    }
    if (index === 20) {
      return new Vacation();
    }
    if (index === 30) {
      return new Arrestment();
    }

    if (index === 5 || index === 25) {
      return new Taxes({id: index });
    }

    if (index === 15 || index === 35) {
      return new Payment({id: index });
    }

    const randomType = Math.floor(Math.random() * 3);

    switch (randomType) {
      case 0:
        return new Building({
          id: index,
          name: `TERRENO Nº${index}`,
          rent: index * 1000,
        });
      case 1:
        return new Enterprise({
          id: index,
          name: `NEGÓCIO Nº${index}`,
          price: Math.floor(index / 10) * 10000,
        });
      case 2:
        return new Event({ id: index });
      default:
        return new Building({
          id: index,
          name: `TERRENO Nº${index}`,
          rent: index * 1000,
        });
    }
  });

  const JSONSpaces = spaces.map(value => {
    const type = value.constructor.name;

    return {...value, type }
  });

  return {
    props: {
      pawns,
      spaces: JSONSpaces,
    },
  }
}