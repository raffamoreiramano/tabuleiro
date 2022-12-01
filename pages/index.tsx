import Head from 'next/head';
import Image from 'next/image';
import { useState } from 'react';

import styles from '../styles/index.module.css';

type pawn = {
  color: string,
  space: number,
  user: any,
  moving: boolean,
}

interface User {

}

enum SpaceTypes {
  BUILDING,
  ENTERPRISE,
  EVENT,
}

abstract class Space {
  id: number;
  readonly name: string;

  constructor(id: number, name: string) {
    this.id = id;
    this.name = name;
  }
}

class Start extends Space {
  constructor() {
    super(0, 'Início');
  }
}

class Prison extends Space {
  constructor() {
    super(10, 'Prisão');
  }
}

class Vacation extends Space {
  constructor() {
    super(20, 'Férias');
  }
}

class Arrestment extends Space {
  constructor() {
    super(30, 'Camburão');
  }
}

class Taxes extends Space {
  constructor({ id }: { id: number }) {
    super(id, 'Dia de pagar impostos');
  }
}

class Payment extends Space {
  constructor({ id }: { id: number }) {
    super(id, 'Dia do pagamento');
  }
}

abstract class Property extends Space {
  owner: User | null = null;

  constructor(id: number, name: string) {
    super(id, name);
  }
}

class Building extends Property {
  houses: number = 0;
  limit: number;
  rent: number;
  fee: number;

  constructor({id, name, rent, limit = 5, fee = 10}: { id: number, name: string, rent: number, limit?: number, fee?: number }) {
    super(id, name);

    this.limit = limit;
    this.rent = rent;
    this.fee = fee;
  }
}

class Enterprise extends Property {
  price: number;

  constructor({ id, name, price }: { id: number, name: string, price: number }) {
    super(id, name);

    this.price = price;
  }
}

class Event extends Space {
  constructor({ id }: { id: number }) {
    super(id, 'Sorte ou Azar');
  }
}

export default function Home(props: { pawns: { [key: string]: pawn}, spaces: any[] }) {
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

  const handleBuilding = (pawn: pawn, space: Building) => {
    console.log('pawn:', pawn);
    console.log('space:', space);
  }

  const handleEnterprise = (pawn: pawn, space: Enterprise) => {
    console.log('pawn:', pawn);
    console.log('space:', space);
  }
  
  const handleEvent = (pawn: pawn, space: Event) => {
    console.log('pawn:', pawn);
    console.log('space:', space);
  }
  
  const handleTaxes = (pawn: pawn, space: Taxes) => {
    console.log('pawn:', pawn);
    console.log('space:', space);
  }
  
  const handlePayment = (pawn: pawn, space: Payment) => {
    console.log('pawn:', pawn);
    console.log('space:', space);
  }
  
  const handlePrison = (pawn: pawn, space: Prison) => {
    console.log('pawn:', pawn);
    console.log('space:', space);
  }
  
  const handleVacation = (pawn: pawn, space: Vacation) => {
    console.log('pawn:', pawn);
    console.log('space:', space);
  }

  const handleArrestment = (pawn: pawn, space: Arrestment) => {
    console.log('pawn:', pawn);
    console.log('space:', space);
  }

  const handleLap = (pawn: pawn) => {
    console.log('pawn:', pawn);
  }

  const handleArrival = (pawn: pawn, destination: number) => {
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

  const movePawn = async (pawn: pawn, steps: number, traveled = 0, lap = false): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 200));

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
    }

    const pawnUpdate: pawn = {...pawn};

    

    pawnUpdate.space = next;

    pawnUpdate.moving = next !== destination;

    setPawns({...pawns, [pawn.color]: pawnUpdate});

    if (next !== destination) {
      return movePawn(pawn, steps, traveled, lap);
    }

    handleArrival(pawn, destination);
  }

  return (
    <>
      <Head>
        <title>Barco Imobiliário</title>
        <meta name="description" content="Jogo de tabuleiro criado com NEXT.js" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <main className={styles.main}>
        <h1 onClick={() => movePawn(pawns.black, 3)}>Barco Imobiliário</h1>
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
  const pawns: { [key: string]: pawn } =
  {
    'black': {
      user: {},
      color: 'black',
      space: 0,
      moving: false,
    },
    'red': {
      user: {},
      color: 'red',
      space: 0,
      moving: false,
    },
    'green': {
      user: {},
      color: 'green',
      space: 0,
      moving: false,
    },
    'blue': {
      user: {},
      color: 'blue',
      space: 0,
      moving: false,
    },
    'yellow': {
      user: {},
      color: 'yellow',
      space: 0,
      moving: false,
    },
    'white': {
      user: {},
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