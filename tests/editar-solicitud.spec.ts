import { test, expect } from '@playwright/test'

test.describe('Editar solicitud', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173/login')
    await page.getByLabel('Usuario').fill('alumno')
    await page.getByLabel('Contraseña').fill('Playwright123')
    await page.getByRole('button', { name: 'Iniciar sesión' }).click()
    await expect(page).toHaveURL('http://localhost:5173/')

    await page.goto('http://localhost:5173/solicitudes/req-001/editar')
    await expect(page.getByTestId('edit-request-page')).toBeVisible()
  })

  test('éxito: el formulario precarga los datos de la solicitud', async ({ page }) => {
    await expect(page.getByLabel('Título')).toHaveValue('Revisión de cuenta corporativa')
    await expect(page.getByLabel('Descripción')).toHaveValue(/nombre del departamento/)
    await expect(page.getByLabel('Categoría')).toHaveValue('Facturación')
    await expect(page.getByLabel('Prioridad')).toHaveValue('Media')
    await expect(page.getByLabel('Estado')).toHaveValue('Pendiente')
  })

  test('éxito: guardar los cambios redirige al detalle y los actualiza', async ({ page }) => {
    const title = 'Revisión de cuenta corporativa (editada)'

    await page.getByLabel('Título').fill(title)
    await page.getByLabel('Estado').selectOption('En progreso')
    await page.getByRole('button', { name: 'Guardar cambios' }).click()

    await expect(page).toHaveURL('http://localhost:5173/solicitudes/req-001')
    await expect(page.getByTestId('success-message')).toContainText(title)
    await expect(page.getByTestId('detail-title')).toHaveText(title)
    await expect(page.getByTestId('detail-status').getByTestId('status-badge')).toHaveText(
      'En progreso',
    )
  })

  test('éxito: cancelar sale al listado sin aplicar los cambios', async ({ page }) => {
    await page.getByLabel('Título').fill('Cambio que no debe guardarse')
    await page.getByLabel('Estado').selectOption('Completada')

    await page.getByRole('button', { name: 'Cancelar' }).click()

    await expect(page).toHaveURL('http://localhost:5173/')
    await expect(page.getByTestId('request-title').filter({ hasText: 'Cambio que no debe guardarse' })).toHaveCount(0)

    const originalRow = page.getByTestId('request-row').filter({ hasText: 'Revisión de cuenta corporativa' })
    await expect(originalRow).toHaveCount(1)
    await expect(originalRow.getByTestId('status-badge')).toHaveText('Pendiente')
  })

  test('error: vaciar el título bloquea el guardado y muestra la validación', async ({ page }) => {
    await page.getByLabel('Título').fill('')
    await page.getByLabel('Estado').selectOption('En progreso')
    await page.getByRole('button', { name: 'Guardar cambios' }).click()

    await expect(page).toHaveURL('http://localhost:5173/solicitudes/req-001/editar')
    await expect(page.getByTestId('title-error')).toHaveText('El título es obligatorio.')
    await expect(page.getByLabel('Título')).toHaveAttribute('aria-invalid', 'true')
    await expect(page.getByTestId('success-message')).toHaveCount(0)
  })
})
