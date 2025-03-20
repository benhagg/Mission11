using backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers;

[ApiController]
[Route("[controller]")]
public class BookstoreController : ControllerBase
{
    private readonly BookstoreContext _context;

    public BookstoreController(BookstoreContext context)
    {
        _context = context;
    }

    [HttpGet("books")]
    public async Task<ActionResult<IEnumerable<Book>>> GetAllBooks([FromQuery] int page = 1, [FromQuery] int displayNum = 5, [FromQuery] bool sort = true)
    {
        IQueryable<Book> query = _context.Books;

        if (sort)
        {
            query = query.OrderBy(b => b.Title);
        }

        List<Book> books = await query
            .Skip((page - 1) * displayNum)
            .Take(displayNum)
            .ToListAsync();

        return Ok(books);
    }
}
