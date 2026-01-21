import prisma from './config/db.js';

async function main() {
    try {
        // 1. Create a Department
        const dept = await prisma.department.create({
            data: {
                name: 'General Medicine',
                code: 'MED-001',
                type: 'Clinical'
            }
        });
        console.log('SUCCESS: Created Department');
        console.log('ID:', dept.id);
        console.log('Name:', dept.name);
    } catch (e) {
        if (e.code === 'P2002') {
            console.log('Department already exists (Duplicate Code). Fetching existing...');
            const existing = await prisma.department.findUnique({ where: { code: 'MED-001' } });
            console.log('ID:', existing.id);
        } else {
            console.error(e);
        }
    } finally {
        await prisma.$disconnect();
    }
}

main();
