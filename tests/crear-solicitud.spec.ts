import { test, expect } from '@playwright/test'

test.describe('Crear solicitud', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173/login')
    await page.getByLabel('Usuario').fill('alumno')
    await page.getByLabel('Contraseña').fill('Playwright123')
    await page.getByRole('button', { name: 'Iniciar sesión' }).click()
    await expect(page).toHaveURL('http://localhost:5173/')

    await page.goto('http://localhost:5173/solicitudes/nueva')
    await expect(page.getByTestId('request-form')).toBeVisible()
  })

  test('éxito: crear una solicitud redirige al listado y aparece como "Pendiente"', async ({
    page,
  }) => {
    const title = 'Solicitud de prueba E2E'

    await page.getByLabel('Título').fill(title)
    await page
      .getByLabel('Descripción')
      .fill('Descripción creada desde una prueba automatizada de Playwright.')
    await page.getByLabel('Categoría').selectOption('Técnico')
    await page.getByLabel('Prioridad').selectOption('Alta')

    await page.getByRole('button', { name: 'Crear solicitud' }).click()

    await expect(page).toHaveURL('http://localhost:5173/')
    await expect(page.getByTestId('success-message')).toContainText(title)

    const newRow = page.getByTestId('request-row').filter({ hasText: title })
    await expect(newRow).toHaveCount(1)
    await expect(newRow.getByTestId('status-badge')).toHaveText('Pendiente')
    await expect(page.getByTestId('request-row')).toHaveCount(6)
  })

  test('éxito: cancelar vuelve al listado sin guardar la solicitud', async ({ page }) => {
    const title = 'Solicitud que no debe guardarse'

    await page.getByLabel('Título').fill(title)
    await page.getByLabel('Descripción').fill('Este texto no debe llegar a persistirse.')
    await page.getByLabel('Categoría').selectOption('General')
    await page.getByLabel('Prioridad').selectOption('Baja')

    await page.getByRole('button', { name: 'Cancelar' }).click()

    await expect(page).toHaveURL('http://localhost:5173/')
    await expect(page.getByTestId('request-row')).toHaveCount(5)
    await expect(page.getByTestId('request-title').filter({ hasText: title })).toHaveCount(0)
  })

  test('error: enviar con los campos vacíos muestra la validación de cada campo', async ({
    page,
  }) => {
    await page.getByRole('button', { name: 'Crear solicitud' }).click()

    await expect(page).toHaveURL('http://localhost:5173/solicitudes/nueva')
    await expect(page.getByTestId('title-error')).toHaveText('El título es obligatorio.')
    await expect(page.getByTestId('description-error')).toHaveText('La descripción es obligatoria.')
    await expect(page.getByTestId('category-error')).toHaveText(
      'Debes seleccionar una categoría válida.',
    )
    await expect(page.getByTestId('priority-error')).toHaveText(
      'Debes seleccionar una prioridad válida.',
    )

    await expect(page.getByLabel('Título')).toHaveAttribute('aria-invalid', 'true')
    await expect(page.getByLabel('Descripción')).toHaveAttribute('aria-invalid', 'true')
    await expect(page.getByLabel('Categoría')).toHaveAttribute('aria-invalid', 'true')
    await expect(page.getByLabel('Prioridad')).toHaveAttribute('aria-invalid', 'true')
  })
})
