// scripts/deleteUser.ts
import { prisma } from '@/lib/prisma';

async function deleteUserByEmail(email: string) {
  try {
    const deletedUser = await prisma.user.delete({
      where: {
        email: email,
      },
    });
    console.log(`Usuario con correo ${email} eliminado:`, deletedUser);
  } catch (error) {
    console.error(`Error al eliminar el usuario con correo ${email}:`, error);
  } finally {
    await prisma.$disconnect();
  }
}

deleteUserByEmail('basereferenciales@gmail.com');