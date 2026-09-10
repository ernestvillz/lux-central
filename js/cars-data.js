/* ============================================================
   LUX CENTRAL — vehicle data
   bodyType controls the procedural 3D silhouette (see car-builder.js)
   ============================================================ */

const CARS = [
  {
    id: 'meridian',
    name: 'Meridian',
    category: 'Flagship Sedan',
    bodyType: 'sedan',
    price: 68900,
    color: 0x1c2c4a,
    desc: 'The car the rest of the lineup is measured against. Low, long, and unmistakably Lux Central — the Meridian trades excess for precision.',
    specs: { Horsepower: '429 hp', '0–60 mph': '4.2 s', 'Top speed': '155 mph', Drivetrain: 'AWD', 'Fuel economy': '24 city / 33 hwy' }
  },
  {
    id: 'aventis',
    name: 'Aventis',
    category: 'Luxury SUV',
    bodyType: 'suv',
    price: 74500,
    color: 0x24324a,
    desc: 'Command the road without giving up an inch of comfort. Three rows, one silhouette that still turns heads at valet.',
    specs: { Horsepower: '400 hp', '0–60 mph': '5.1 s', 'Top speed': '143 mph', Drivetrain: 'AWD', 'Fuel economy': '20 city / 27 hwy' }
  },
  {
    id: 'solstice',
    name: 'Solstice',
    category: 'Grand Coupe',
    bodyType: 'coupe',
    price: 82300,
    color: 0x14213a,
    desc: 'A two-door statement. The Solstice sits four inches lower than the Meridian and never lets you forget it.',
    specs: { Horsepower: '505 hp', '0–60 mph': '3.6 s', 'Top speed': '168 mph', Drivetrain: 'RWD', 'Fuel economy': '19 city / 28 hwy' }
  },
  {
    id: 'volt',
    name: 'Volt EV',
    category: 'Electric',
    bodyType: 'ev',
    price: 71200,
    color: 0x2b3b56,
    desc: 'Zero emissions, zero compromise. The Volt is the quietest thing in the showroom — right up until you press the accelerator.',
    specs: { Horsepower: '480 hp', '0–60 mph': '3.9 s', 'Top speed': '150 mph', Drivetrain: 'AWD', Range: '340 mi' }
  },
  {
    id: 'zephyr',
    name: 'Zephyr',
    category: 'Convertible',
    bodyType: 'convertible',
    price: 89900,
    color: 0x1a2740,
    desc: 'Roof down, the Zephyr is the closest thing we make to open water. Hand-finished in a matter of weeks, not months.',
    specs: { Horsepower: '460 hp', '0–60 mph': '4.0 s', 'Top speed': '160 mph', Drivetrain: 'RWD', 'Fuel economy': '18 city / 26 hwy' }
  }
];
