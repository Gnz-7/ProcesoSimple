import { test, expect } from '@playwright/test'

test.describe('Inicio de sesión', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173/login')
  })

  test('éxito: las credenciales válidas redirigen a "/"', async ({ page }) => {
    await page.getByLabel('Usuario').fill('alumno')
    await page.getByLabel('Contraseña').fill('Playwright123')
    await page.getByRole('button', { name: 'Iniciar sesión' }).click()

    await expect(page).toHaveURL('http://localhost:5173/')
  })

  test('error: con los campos vacíos se bloquea el envío y se muestra la validación', async ({
    page,
  }) => {
    await page.getByRole('button', { name: 'Iniciar sesión' }).click()

    await expect(page).toHaveURL('http://localhost:5173/login')
    await expect(page.getByTestId('username-error')).toHaveText('El usuario es obligatorio.')
    await expect(page.getByTestId('password-error')).toHaveText('La contraseña es obligatoria.')
    await expect(page.getByLabel('Usuario')).toHaveAttribute('aria-invalid', 'true')
    await expect(page.getByLabel('Contraseña')).toHaveAttribute('aria-invalid', 'true')
  })

  test('error: las credenciales inválidas muestran un mensaje en pantalla', async ({ page }) => {
    await page.getByLabel('Usuario').fill('usuario.incorrecto')
    await page.getByLabel('Contraseña').fill('clave.incorrecta')
    await page.getByRole('button', { name: 'Iniciar sesión' }).click()

    await expect(page).toHaveURL('http://localhost:5173/login')
    await expect(page.getByTestId('login-error')).toHaveText('Usuario o contraseña incorrectos.')
  })
})
