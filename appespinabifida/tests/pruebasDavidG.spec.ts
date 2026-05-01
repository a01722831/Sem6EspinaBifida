import { test, expect } from '@playwright/test';
import { qase } from 'playwright-qase-reporter';

test(qase(1, 'Inicio de Sesion exitoso'), async ({page}) => {
  await page.goto('http://www.localhost:3000/');
  await page.getByRole('textbox', { name: 'Usuario' }).click();
  await page.getByRole('textbox', { name: 'Usuario' }).fill('test');
  await page.getByRole('textbox', { name: 'Contraseña' }).click();
  await page.getByRole('textbox', { name: 'Contraseña' }).fill('test');
  await page.getByRole('button', { name: 'Iniciar Sesión' }).click();
  await expect(page.getByRole('heading')).toContainText('Asociados');
})

test(qase(39, 'Login fallido'), async({page}) =>{
  await page.goto('http://www.localhost:3000/');
  await page.getByRole('textbox', { name: 'Usuario' }).click();
  await page.getByRole('textbox', { name: 'Usuario' }).fill('falsepwd');
  await page.getByRole('textbox', { name: 'Contraseña' }).click();
  await page.getByRole('textbox', { name: 'Contraseña' }).fill('falsepwd');
  await page.getByRole('button', { name: 'Iniciar Sesión' }).click();
  await expect(page.getByRole('paragraph')).toContainText('Correo o contraseña incorrectos');
})