import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Book } from './schemas/book.schema';

@Injectable()
export class BookService {
  constructor(
    @InjectModel(Book.name)
    private bookModel: mongoose.Model<Book>,
  ) {}

  async findAll(): Promise<Book[]> {
    const books = await this.bookModel.find();
    return books;
  }

  async create(book: Book): Promise<Book> {
    const res = await this.bookModel.create(book);
    return res;
  }

  async findById(id: string): Promise<Book> {
    const bookExists = await this.bookExist(id);
    if (!bookExists) throw new NotFoundException('Book not found.');
    const book = await this.bookModel.findById(id);

    return book;
  }

  async bookExist(id: string): Promise<boolean> {
    if (!mongoose.isValidObjectId(id))
      throw new BadRequestException('Invalid book id.');
    const book = await this.bookModel.exists({ _id: id });

    if (!book) return false;
    return true;
  }

  async updateById(id: string, book: Book): Promise<Book> {
    const bookExists = await this.bookExist(id);
    if (!bookExists) throw new NotFoundException('Book not found.');
    return await this.bookModel.findByIdAndUpdate(id, book, {
      new: true,
      runValidators: true,
    });
  }

  async deleteById(id: string): Promise<Book> {
    const bookExists = await this.bookExist(id);
    if (!bookExists) throw new NotFoundException('Book not found.');
    return await this.bookModel.findByIdAndDelete(id);
  }
}
