import { PrismaClient, EntryStatus } from '@prisma/client';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

async function main() {
  const entries = Array.from({ length: 100 }).map(() => ({
    name: faker.lorem.words(3),
    done: faker.datatype.boolean(),
    description: faker.lorem.paragraph(),
    startDate: faker.date.past(),
    endDate: faker.date.future(),
    status: faker.helpers.enumValue(EntryStatus),
  }));

  await prisma.entry.createMany({
    data: entries,
  });

  console.log('Seeded 100 entries');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
