import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkSejarah() {
  try {
    const page = await prisma.pageContent.findUnique({
      where: { key: 'sejarah' }
    });
    
    if (page) {
      console.log('--- FOUND SEJARAH ---');
      console.log('Title:', page.title);
      console.log('Content Length:', page.content.length);
      console.log('Content Preview (1000 chars):', page.content.substring(0, 1000));
    } else {
      console.log('--- SEJARAH NOT FOUND IN DB ---');
    }
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkSejarah();
