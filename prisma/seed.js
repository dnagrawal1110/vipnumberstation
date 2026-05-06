const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

const numbersDB = [
  {raw:"9208600307",display:"92086 00307",highlight:"00307",mrp:2370,price:2133,discount:10,operator:"Jio",type:"RTP",category:"ENDING 000",sumBreak:"35-8-8",sum:8,dealer:"Own"},
  {raw:"9921461313",display:"9921 46 1313",highlight:"1313",mrp:7055,price:6350,discount:10,operator:"Airtel",type:"RTP",category:"XY-XY",sumBreak:"39-12-3",sum:3,dealer:"Own"},
  {raw:"9511719595",display:"9511 71 9595",highlight:"9595",mrp:5400,price:5400,discount:0,operator:"Jio",type:"Non-RTP",category:"ENDING XY-XY-XY",sumBreak:"52-7-7",sum:7,rtpDate:"2026-07-15",dealer:"Dealer 1"},
  {raw:"9583682836",display:"95 836 82 836",highlight:"836",mrp:2210,price:1989,discount:10,operator:"Airtel",type:"RTP",category:"ENDING XYZ-XYZ",sumBreak:"58-13-4",sum:4,dealer:"Own"},
  {raw:"9675391055",display:"967 539 1055",highlight:"1055",mrp:7727,price:5796,discount:25,operator:"Vi",type:"Non-RTP",category:"ENDING TETRA",sumBreak:"50-5-5",sum:5,rtpDate:"2026-08-22",dealer:"Dealer 2"},
  {raw:"8853345674",display:"8853 34567 4",highlight:"34567",mrp:1770,price:1416,discount:20,operator:"Jio",type:"RTP",category:"COUNTING NUMBER",sumBreak:"53-8-8",sum:8,dealer:"Own"},
  {raw:"8308301961",display:"830830 1961",highlight:"830830",mrp:3674,price:2940,discount:20,operator:"Airtel",type:"RTP",category:"STARTING XYZ-XYZ",sumBreak:"39-12-3",sum:3,dealer:"Own"},
  {raw:"7080409007",display:"708040 9007",highlight:"9007",mrp:5880,price:5292,discount:10,operator:"Jio",type:"Non-RTP",category:"ENDING TETRA",sumBreak:"35-8-8",sum:8,rtpDate:"2026-09-10",dealer:"Dealer 1"},
  {raw:"7559765955",display:"7 55 97659 55",highlight:"55",mrp:9730,price:8757,discount:10,operator:"Vi",type:"RTP",category:"ENDING PENTA",sumBreak:"63-9-9",sum:9,dealer:"Own"},
  {raw:"9091700085",display:"9090 2 00085",highlight:"00085",mrp:9729,price:8757,discount:10,operator:"Airtel",type:"RTP",category:"ENDING 0000",sumBreak:"33-6-6",sum:6,dealer:"Own"},
  {raw:"9997770832",display:"999 777 0832",highlight:"999",mrp:6615,price:5954,discount:10,operator:"Jio",type:"Non-RTP",category:"XXX-YYY",sumBreak:"61-7-7",sum:7,rtpDate:"2026-06-30",dealer:"Dealer 3"},
  {raw:"8125678222",display:"8 125678 222",highlight:"222",mrp:6614,price:5953,discount:10,operator:"Airtel",type:"RTP",category:"ENDING XXX",sumBreak:"43-7-7",sum:7,dealer:"Own"},
  {raw:"9073974001",display:"973 973 4001",highlight:"973",mrp:3674,price:2572,discount:30,operator:"Jio",type:"RTP",category:"STARTING XYZ-XYZ",sumBreak:"43-7-7",sum:7,dealer:"Own"},
  {raw:"7063560555",display:"7063 560 555",highlight:"555",mrp:25020,price:22518,discount:10,operator:"Airtel",type:"Non-RTP",category:"ENDING XXX",sumBreak:"42-6-6",sum:6,rtpDate:"2026-10-05",dealer:"Dealer 1"},
  {raw:"9085074000",display:"9085 074 000",highlight:"000",mrp:6615,price:5623,discount:15,operator:"Vi",type:"RTP",category:"ENDING 000",sumBreak:"33-6-6",sum:6,dealer:"Own"},
  {raw:"7066170555",display:"70 661 70 555",highlight:"555",mrp:15180,price:13662,discount:10,operator:"Jio",type:"RTP",category:"ENDING XXX",sumBreak:"42-6-6",sum:6,dealer:"Dealer 2"},
  {raw:"8282826714",display:"828282 6714",highlight:"828282",mrp:5145,price:4631,discount:10,operator:"Airtel",type:"Non-RTP",category:"MIRROR NUMBER",sumBreak:"48-12-3",sum:3,rtpDate:"2026-07-28",dealer:"Own"},
  {raw:"9635791101",display:"96357 91101",highlight:"91101",mrp:7350,price:6615,discount:10,operator:"Jio",type:"RTP",category:"SEMI-MIRROR NUMBER",sumBreak:"42-6-6",sum:6,dealer:"Own"},
  {raw:"6399690666",display:"6399 690 666",highlight:"666",mrp:10425,price:9383,discount:10,operator:"Vi",type:"Non-RTP",category:"ENDING XXX",sumBreak:"60-6-6",sum:6,rtpDate:"2026-08-14",dealer:"Dealer 1"},
  {raw:"9759752120",display:"975 975 2120",highlight:"975",mrp:3690,price:3321,discount:10,operator:"Airtel",type:"RTP",category:"STARTING XYZ-XYZ",sumBreak:"47-11-2",sum:2,dealer:"Own"},
  {raw:"9777266637",display:"9777 2666 37",highlight:"666",mrp:3400,price:3060,discount:10,operator:"Jio",type:"RTP",category:"XXX-YYY",sumBreak:"60-6-6",sum:6,dealer:"Own"},
  {raw:"9876543210",display:"98765 43210",highlight:"98765",mrp:15000,price:12500,discount:17,operator:"Airtel",type:"RTP",category:"COUNTING NUMBER",sumBreak:"45-9-9",sum:9,dealer:"Own"},
  {raw:"7860007860",display:"786 000 7860",highlight:"786",mrp:8000,price:7200,discount:10,operator:"Jio",type:"Non-RTP",category:"786 SPECIAL",sumBreak:"42-6-6",sum:6,rtpDate:"2026-09-20",dealer:"Dealer 2"},
  {raw:"9999999990",display:"99999 99990",highlight:"9999",mrp:50000,price:45000,discount:10,operator:"Airtel",type:"RTP",category:"ENDING PENTA",sumBreak:"81-9-9",sum:9,dealer:"Own"}
]

async function main() {
  console.log('Start seeding...')
  await prisma.vIPNumber.deleteMany()
  for (const n of numbersDB) {
    const num = await prisma.vIPNumber.create({
      data: {
        rawNumber: n.raw,
        displayFormat: n.display,
        highlight: n.highlight,
        mrp: n.mrp,
        price: n.price,
        discount: n.discount,
        operator: n.operator,
        type: n.type,
        rtpDate: n.rtpDate,
        category: n.category,
        sumBreakdown: n.sumBreak,
        sum: n.sum,
        dealer: n.dealer
      }
    })
    console.log(`Created number: ${num.displayFormat}`)
  }
  console.log('Seeding finished.')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
