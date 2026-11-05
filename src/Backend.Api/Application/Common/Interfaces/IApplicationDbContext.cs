using Backend.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Backend.Application.Common.Interfaces;

public interface IApplicationDbContext
{
    DbSet<Product> Products { get; }
    Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
}
