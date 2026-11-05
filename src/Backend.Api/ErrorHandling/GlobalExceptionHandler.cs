using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Api.ErrorHandling;

/// <summary>
/// Último recurso para excepciones no controladas: nunca filtra ex.Message ni stack traces
/// al cliente (RFC 7807). El detalle real queda solo en el log estructurado.
/// </summary>
public class GlobalExceptionHandler(
    ILogger<GlobalExceptionHandler> logger,
    IProblemDetailsService problemDetailsService) : IExceptionHandler
{
    public async ValueTask<bool> TryHandleAsync(
        HttpContext httpContext,
        Exception exception,
        CancellationToken cancellationToken)
    {
        logger.LogError(
            exception,
            "Excepción no controlada procesando {Method} {Path}",
            httpContext.Request.Method,
            httpContext.Request.Path);

        httpContext.Response.StatusCode = StatusCodes.Status500InternalServerError;

        return await problemDetailsService.TryWriteAsync(new ProblemDetailsContext
        {
            HttpContext = httpContext,
            ProblemDetails = new ProblemDetails
            {
                Status = StatusCodes.Status500InternalServerError,
                Title = "Ha ocurrido un error inesperado.",
                Detail = "Contacte al administrador si el problema persiste.",
                Type = "https://tools.ietf.org/html/rfc7231#section-6.6.1",
            },
        });
    }
}
