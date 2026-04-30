import { test, expect } from '@playwright/test';

// Función para hacer login y navegar al formulario de movimiento
async function loginYNavegar(page: any) {
  await page.goto('http://localhost:3000/');
  await page.getByRole('textbox', { name: 'Usuario' }).fill('test');
  await page.getByRole('textbox', { name: 'Contraseña' }).fill('test');
  await page.getByRole('button', { name: 'Iniciar Sesión' }).click();
  await page.getByRole('link', { name: 'Inventario' }).click();
  await page.getByRole('button', { name: 'Movimiento Inventario' }).click();
  await page.getByRole('button', { name: 'Agregar' }).click();
}

// TC-01: positivo, Registrar movimiento exitoso
test('TC-01 - Registrar movimiento de inventario exitoso', async ({ page }) => {
  await loginYNavegar(page);

  // Buscar y seleccionar medicamento
  await page.getByRole('textbox', { name: 'Escribe para buscar y' }).fill('Paracetamol');
  await page.getByRole('button', { name: 'Paracetamol Medicamento' }).click();

  // Llenar cantidad y descripcion
  await page.getByPlaceholder('0').fill('10');
  await page.getByRole('textbox', { name: 'Detalles del movimiento' }).fill('Entrada de prueba automatizada');

  // Registrar
  await page.getByRole('button', { name: 'Registrar Movimiento' }).click();

  // Verificar que aparece en el historial
  await expect(
    page.locator('div').filter({ hasText: /Paracetamol/ }).first()
  ).toBeVisible();
});

// TC-02:  negativo, Cantidad invalida (numero negativo)
test('TC-02 - Registrar movimiento con cantidad inválida', async ({ page }) => {
  await loginYNavegar(page);

  // Buscar y seleccionar medicamento
  await page.getByRole('textbox', { name: 'Escribe para buscar y' }).fill('Paracetamol');
  await page.getByRole('button', { name: 'Paracetamol Medicamento' }).click();

  // Llenar con cantidad invalida
  await page.getByPlaceholder('0').fill('-1');
  await page.getByRole('textbox', { name: 'Detalles del movimiento' }).fill('Prueba cantidad inválida');

  // Intentar registrar
  await page.getByRole('button', { name: 'Registrar Movimiento' }).click();

  // Verificar que NO se registro (el formulario sigue visible o muestra error)
  await expect(
    page.getByRole('button', { name: 'Registrar Movimiento' })
  ).toBeVisible();
});