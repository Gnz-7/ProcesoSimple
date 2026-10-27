import { test, expect } from '@playwright/test'

test.describe('Listado de solicitudes', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173/login')
    await page.getByLabel('Usuario').fill('alumno')
    await page.getByLabel('Contraseña').fill('Playwright123')
    await page.getByRole('button', { name: 'Iniciar sesión' }).click()
    await expect(page).toHaveURL('http://localhost:5173/')
  })

  test('éxito: la tabla carga filas con todas sus columnas', async ({ page }) => {
    await expect(page.getByTestId('requests-table')).toBeVisible()

    await expect(page.getByRole('columnheader')).toHaveText([
      'Título',
      'Categoría',
      'Prioridad',
      'Estado',
      'Fecha de creación',
      'Acciones',
    ])

    await expect(page.getByTestId('request-row')).toHaveCount(5)
    await expect(page.getByTestId('request-row').first().getByRole('cell')).toHaveCount(6)
  })

  test('éxito: buscar por título reduce la lista a las coincidencias', async ({ page }) => {
    await page.getByLabel('Buscar por título').fill('factura')

    await expect(page.getByTestId('request-row')).toHaveCount(1)
    await expect(page.getByTestId('request-title')).toHaveText('Consulta sobre factura de enero')
  })

  test('éxito: filtrar por estado muestra solo badges de ese estado', async ({ page }) => {
    await page.getByLabel('Filtrar por estado').selectOption('Completada')

    await expect(page.getByTestId('request-row')).toHaveCount(2)
    await expect(page.getByTestId('status-badge')).toHaveText(['Completada', 'Completada'])
  })

  test('éxito: restablecer datos de prueba recarga el listado y muestra la alerta', async ({
    page,
  }) => {
    await page.getByTestId('delete-req-001').click()
    await page.getByTestId('confirm-accept').click()
    await expect(page.getByTestId('request-row')).toHaveCount(4)

    await page.getByRole('button', { name: 'Restablecer datos de prueba' }).click()
    await expect(page.getByTestId('confirm-dialog')).toBeVisible()
    await page.getByTestId('confirm-accept').click()

    await expect(page.getByTestId('success-message')).toHaveText(
      'Los datos de prueba han sido restablecidos.',
    )
    await expect(page.getByTestId('request-row')).toHaveCount(5)
  })

  test('éxito: "Nueva solicitud" redirige a /solicitudes/nueva', async ({ page }) => {
    await page.getByRole('link', { name: 'Nueva solicitud' }).click()

    await expect(page).toHaveURL('http://localhost:5173/solicitudes/nueva')
  })

  test('caso borde: una búsqueda inexistente muestra el estado vacío', async ({ page }) => {
    await page.getByLabel('Buscar por título').fill('zzzz-no-existe')

    await expect(page.getByTestId('empty-message')).toBeVisible()
    await expect(page.getByTestId('requests-table')).toHaveCount(0)
    await expect(page.getByTestId('request-row')).toHaveCount(0)
  })

  test('caso borde: cancelar la eliminación conserva la fila', async ({ page }) => {
    const firstRow = page.getByTestId('request-row').first()
    const title = await firstRow.getByTestId('request-title').innerText()

    await firstRow.getByRole('button', { name: 'Eliminar' }).click()
    await expect(page.getByTestId('confirm-dialog')).toBeVisible()

    await page.getByTestId('confirm-cancel').click()
    await expect(page.getByTestId('confirm-dialog')).toHaveCount(0)

    await expect(page.getByTestId('request-row')).toHaveCount(5)
    await expect(page.getByTestId('request-row').filter({ hasText: title })).toHaveCount(1)
  })
})
