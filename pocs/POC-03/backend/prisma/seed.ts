import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const docente1 = await prisma.user.upsert({
    where: { email: 'docente1@umss.edu' },
    update: {},
    create: { name: 'Lic. Alejandro Vargas', email: 'docente1@umss.edu', password: 'docente123', role: 'DOCENTE' },
  });

  await prisma.user.upsert({
    where: { email: 'docente2@umss.edu' },
    update: {},
    create: { name: 'Dra. Carmen Soliz', email: 'docente2@umss.edu', password: 'docente123', role: 'DOCENTE' },
  });

  await prisma.user.upsert({
    where: { email: 'estudiante1@umss.edu' },
    update: {},
    create: { name: 'Sebastián Mamani', email: 'estudiante1@umss.edu', password: 'estudiante123', role: 'ESTUDIANTE' },
  });

  await prisma.user.upsert({
    where: { email: 'estudiante2@umss.edu' },
    update: {},
    create: { name: 'Ana Laura Flores', email: 'estudiante2@umss.edu', password: 'estudiante123', role: 'ESTUDIANTE' },
  });

  await prisma.simonDrop.createMany({
    data: [
      { name: 'Proyecto Final — Ingeniería de Software', description: 'Entrega del proyecto final del semestre. Formato PDF.', docenteId: docente1.id },
      { name: 'Tarea 3 — Arquitectura Hexagonal', description: 'Diagrama C4 nivel 2 + descripción de ports y adapters.', docenteId: docente1.id },
    ],
    skipDuplicates: true,
  });

  console.log('Seed completado. Usuarios:');
  console.log('  docente1@umss.edu   / docente123    (DOCENTE)');
  console.log('  docente2@umss.edu   / docente123    (DOCENTE)');
  console.log('  estudiante1@umss.edu / estudiante123 (ESTUDIANTE)');
  console.log('  estudiante2@umss.edu / estudiante123 (ESTUDIANTE)');
}

main().catch(console.error).finally(() => prisma.$disconnect());
