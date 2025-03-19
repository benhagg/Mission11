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
    public async Task<ActionResult<IEnumerable<Book>>> GetAllBooks()
    {
        List<Book> books = await _context.Books.ToListAsync();
        return Ok(books);
    }
}
