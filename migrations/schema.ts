import { pgTable, unique, uuid, varchar, text, integer, date, timestamp, foreignKey, pgEnum } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"

export const borrowStatus = pgEnum("borrow_status", ['BORROWED', 'RETURNED'])
export const role = pgEnum("role", ['USER', 'ADMIN'])
export const status = pgEnum("status", ['PENDING', 'APPROVED', 'REJECTED'])


export const users = pgTable("users", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	fullName: varchar("full_name", { length: 255 }).notNull(),
	email: text().notNull(),
	universityId: integer("university_id").notNull(),
	password: text().notNull(),
	universityCard: text("university_card").notNull(),
	status: status().default('PENDING'),
	role: role().default('USER'),
	lastActivityDate: date("last_activity_date").defaultNow(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow(),
}, (table) => [
	unique("users_email_unique").on(table.email),
	unique("users_university_id_unique").on(table.universityId),
]);

export const books = pgTable("books", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	title: varchar({ length: 255 }).notNull(),
	author: varchar({ length: 255 }).notNull(),
	genre: varchar().notNull(),
	rating: integer().notNull(),
	coverUrl: text("cover_url").notNull(),
	coverColor: varchar("cover_color", { length: 7 }).notNull(),
	description: text().notNull(),
	totalCopies: integer("total_copies").notNull(),
	availableCopies: integer("available_copies").notNull(),
	videoUrl: text("video_url").notNull(),
	summary: varchar().notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow(),
});

export const borrowRecords = pgTable("borrow_records", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	usersId: uuid("users_id").notNull(),
	booksId: uuid("books_id").notNull(),
	borrowDate: timestamp("borrow_date", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	dueDate: date("due_date").notNull(),
	returnedDate: date("returned_date").notNull(),
	status: borrowStatus().default('BORROWED').notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.usersId],
			foreignColumns: [users.id],
			name: "borrow_records_users_id_users_id_fk"
		}),
	foreignKey({
			columns: [table.booksId],
			foreignColumns: [books.id],
			name: "borrow_records_books_id_books_id_fk"
		}),
]);
