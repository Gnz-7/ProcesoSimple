import { test, expect } from '@playwright/test'

test.describe('Detalle de solicitud', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173/login')
    await page.getByLabel('Usuario').fill('alumno')
    await page.getByLabel('Contraseña').fill('Playwright123')
    await page.getByRole('button', { name: 'Iniciar sesión' }).click()
    await expect(page).toHaveURL('http://localhost:5173/')

    await page.goto('http://localhost:5173/solicitudes/req-001')
    await expect(page.getByTestId('request-detail')).toBeVisible()
  })

  test('éxito: muestra todos los campos y sus valores', async ({ page }) => {
    await expect(page.getByTestId('request-detail').locator('dt')).toHaveText([
      'Identificador',
      'Título',
      'Descripción',
      'Categoría',
      'Prioridad',
      'Estado',
      'Fecha de creación',
      'Última modificación',
    ])

    await expect(page.getByTestId('detail-id')).toHaveText('req-001')
    await expect(page.getByTestId('detail-title')).toHaveText('Revisión de cuenta corporativa')
    await expect(page.getByTestId('detail-description')).toContainText('nombre del departamento')
    await expect(page.getByTestId('detail-category')).toHaveText('Facturación')
    await expect(page.getByTestId('detail-priority')).toHaveText('Media')
    await expect(page.getByTestId('detail-status').getByTestId('status-badge')).toHaveText(
      'Pendiente',
    )
    await expect(page.getByTestId('detail-created-at')).toHaveText(/\d{1,2}\/\d{1,2}\/\d{4}/)
    await expect(page.getByTestId('detail-updated-at')).toHaveText(/\d{1,2}\/\d{1,2}\/\d{4}/)
  })

  test('éxito: "Volver al listado" redirige a "/"', async ({ page }) => {
    await page.getByRole('link', { name: 'Volver al listado' }).click()

    await expect(page).toHaveURL('http://localhost:5173/')
  })

  test('éxito: "Editar" redirige al formulario de edición', async ({ page }) => {
    await page.getByRole('link', { name: 'Editar' }).click()

    await expect(page).toHaveURL('http://localhost:5173/solicitudes/req-001/editar')
  })

  test('caso borde: cancelar la eliminación mantiene la vista de detalle', async ({ page }) => {
    await page.getByRole('button', { name: 'Eliminar' }).click()
    await expect(page.getByTestId('confirm-dialog')).toBeVisible()

    await page.getByTestId('confirm-cancel').click()

    await expect(page.getByTestId('confirm-dialog')).toHaveCount(0)
    await expect(page).toHaveURL('http://localhost:5173/solicitudes/req-001')
    await expect(page.getByTestId('detail-title')).toHaveText('Revisión de cuenta corporativa')
  })

  test('caso borde: un identificador inexistente muestra "Solicitud no encontrada"', async ({
    page,
  }) => {
    await page.goto('http://localhost:5173/solicitudes/req-999')

    await expect(page.getByTestId('request-not-found')).toBeVisible()
    await expect(page.getByTestId('request-not-found')).toContainText('Solicitud no encontrada')
    await expect(page.getByTestId('request-not-found')).toContainText('req-999')
    await expect(page.getByTestId('request-detail')).toHaveCount(0)
    await expect(page).toHaveURL('http://localhost:5173/solicitudes/req-999')
  })
})
