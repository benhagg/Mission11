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

// GET ALL BOOKS
    [HttpGet("books")]
    public async Task<ActionResult<IEnumerable<Book>>> GetAllBooks([FromQuery] string? category, [FromQuery] int page = 1,
    [FromQuery] int displayNum = 5, [FromQuery] bool sort = true)
    {
        IQueryable<Book> query = _context.Books;

        if (sort)
        {
            query = query.OrderBy(b => b.Title);
            if(category != null)
            {
                query = query.Where(b => b.Category == category);
            }
        }

        List<Book> books = await query
            .Skip((page - 1) * displayNum)
            .Take(displayNum)
            .ToListAsync();

        return Ok(books);
    }

// UPDATE
    [HttpPut("books/{id}")]
    public async Task<IActionResult> UpdateBook(int id, [FromBody] Book book)
    {
        if (id != book.BookId)
        {
            return BadRequest("Book ID mismatch");
        }

        var existingBook = await _context.Books.FindAsync(id);
        if (existingBook == null)
        {
            return NotFound();
        }

        _context.Entry(existingBook).CurrentValues.SetValues(book);

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            return StatusCode(500, "An error occurred while updating the book.");
        }

        return NoContent();
    }

// DELETE
    [HttpDelete("books/{id}")]
    public async Task<IActionResult> DeleteBook(int id)
    {
        var book = await _context.Books.FindAsync(id);
        if (book == null)
        {
            return NotFound();
        }

        _context.Books.Remove(book);
        await _context.SaveChangesAsync();

        return NoContent();
    }

// ADD BOOK
    [HttpPost("books")]
    public async Task<ActionResult<Book>> AddBook([FromBody] Book book)
    {
        _context.Books.Add(book);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetAllBooks), new { id = book.BookId }, book);
    }

}
