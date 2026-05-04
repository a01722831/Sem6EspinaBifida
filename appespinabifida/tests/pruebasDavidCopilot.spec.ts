import { test, expect } from '@playwright/test';
import { qase } from 'playwright-qase-reporter';

const BASE_URL = 'http://localhost:3000';

test.describe('Autenticación', () => {
  test.beforeEach(async ({ page }) => {
    // Navegar a la página de login
    await page.goto(`${BASE_URL}/`);
    await page.waitForLoadState('networkidle');
  });

  test(qase(1, 'Caso de éxito: Login con usuario y contraseña válidos'), async ({ page }) => {
    // Llenar el campo de usuario
    const usuarioInput = page.getByRole('textbox', { name: 'Usuario' });
    await usuarioInput.click();
    await usuarioInput.fill('test');

    // Llenar el campo de contraseña
    const passwordInput = page.getByRole('textbox', { name: 'Contraseña' });
    await passwordInput.click();
    await passwordInput.fill('test');

    // Hacer clic en el botón de iniciar sesión
    const loginButton = page.getByRole('button', { name: 'Iniciar Sesión' });
    await loginButton.click();

    // Esperar a que la navegación se complete
    await page.waitForURL('**/asociados', { timeout: 5000 });
    await page.waitForLoadState('networkidle');

    // Verificar que se redirigió correctamente
    expect(page.url()).toContain('/asociados');

    // Verificar que se muestra el encabezado "Asociados"
    await expect(page.getByRole('heading')).toContainText('Asociados');
  });

  test(qase(39, 'Caso de fallo: Login con credenciales inválidas'), async ({ page }) => {
    // Llenar el campo de usuario con credenciales inválidas
    const usuarioInput = page.getByRole('textbox', { name: 'Usuario' });
    await usuarioInput.click();
    await usuarioInput.fill('falsepwd');

    // Llenar el campo de contraseña con credenciales inválidas
    const passwordInput = page.getByRole('textbox', { name: 'Contraseña' });
    await passwordInput.click();
    await passwordInput.fill('falsepwd');

    // Hacer clic en el botón de iniciar sesión
    const loginButton = page.getByRole('button', { name: 'Iniciar Sesión' });
    await loginButton.click();

    // Esperar a que aparezca el mensaje de error
    await page.waitForSelector('text=Correo o contraseña incorrectos', { timeout: 5000 });

    // Verificar que se muestra el mensaje de error
    await expect(page.getByRole('paragraph')).toContainText('Correo o contraseña incorrectos');

    // Verificar que aún estamos en la página de login
    expect(page.url()).not.toContain('/asociados');
  });
});
