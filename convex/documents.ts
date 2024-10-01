import { v } from "convex/values";

import { mutation, query } from "./_generated/server";
import { Doc, Id } from "./_generated/dataModel";

export const archive = mutation({
  args: { id: v.id("documents") },
  /**
   * Asynchronously archives a document and all its child documents recursively.
   * @param {Object} ctx - The context object containing authentication and database access.
   * @param {Object} args - The arguments object containing the document id.
   * @param {string} args.id - The id of the document to be archived.
   * @returns {Object} The updated document object after archiving.
   * @throws {Error} If the user is not authenticated, document is not found, or user is unauthorized.
   */
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Not authenticated");
    }

    const userId = identity.subject;

    const existingDocument = await ctx.db.get(args.id);

    if (!existingDocument) {
      throw new Error("Not found");
    }

    if (existingDocument.userId !== userId) {
      throw new Error("Unauthorized");
    }

    /**
     * Recursively archives a document and all its child documents.
     * @param {Id<"documents">} documentId - The ID of the parent document to start archiving from.
     * @returns {Promise<void>} A promise that resolves when the archiving process is complete.
     */
    const recursiveArchive = async (documentId: Id<"documents">) => {
      const children = await ctx.db
        .query("documents")
        /**
         * Adds an index to the query for filtering documents by user and parent
         * @param {function} q - The query function to chain the index conditions
         * @returns {function} A query function with added conditions for userId and parentDocument
         */
        .withIndex("by_user_parent", (q) => (
          q
            .eq("userId", userId)
            .eq("parentDocument", documentId)
        ))
        .collect();

      for (const child of children) {
        await ctx.db.patch(child._id, {
          isArchived: true,
        });

        await recursiveArchive(child._id);
      }
    }

    const document = await ctx.db.patch(args.id, {
      isArchived: true,
    });

    /**
     * Retrieves non-archived documents for an authenticated user with a specific parent document.
     * @param {Object} ctx - The context object containing authentication and database access.
     * @param {Object} args - The arguments object containing the parentDocument ID.
     * @param {string} args.parentDocument - The ID of the parent document to filter by.
     * @returns {Promise<Array>} A promise that resolves to an array of document objects.
     */
    recursiveArchive(args.id);

    return document;
  }
})

export const getSidebar = query({
  args: {
    parentDocument: v.optional(v.id("documents"))
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Not authenticated");
    }

    const userId = identity.subject;

    const documents = await ctx.db
      .query("documents")
      /**
       * Applies an index filter to the query based on user and parent document
       * @param {function} q - The query function to chain filters
       * @returns {function} The modified query with additional equality filters
       */
      .withIndex("by_user_parent", (q) =>
        q
          .eq("userId", userId)
          .eq("parentDocument", args.parentDocument)
      )
      /**
       * Filters the query to include only non-archived items
       * @param {Function} q - The query object or function
       * @returns {Function} A filtered query that excludes archived items
       */
      .filter((q) =>
        q.eq(q.field("isArchived"), false)
      )
      .order("desc")
      .collect();

    return documents;
  },
});

export const create = mutation({
  args: {
    title: v.string(),
    parentDocument: v.optional(v.id("documents"))
  },
  /**
   * Asynchronously handles the creation of a new document
   * @param {Object} ctx - The context object containing authentication and database access
   * @param {Object} args - The arguments object containing document details
   * @param {string} args.title - The title of the document
   * @param {string|null} args.parentDocument - The ID of the parent document, if any
   * @returns {Object} The newly created document object
   * @throws {Error} If the user is not authenticated
   */
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Not authenticated");
    }

    const userId = identity.subject;

    const document = await ctx.db.insert("documents", {
      title: args.title,
      parentDocument: args.parentDocument,
      userId,
      isArchived: false,
      isPublished: false,
    });

    return document;
  }
});

export const getTrash = query({
  /**
   * Retrieves archived documents for an authenticated user
   * @param {Object} ctx - The context object containing authentication and database access
   * @returns {Promise<Array>} A promise that resolves to an array of archived documents for the user
   */
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Not authenticated");
    }
/**
 * Adds an index to the query based on the userId
 * @param {function} q - The query function to be chained
 * @param {string} userId - The user identifier to filter by
 * @returns {Query} The modified query object with the added index
 */

    /**
     * Filters an array of objects to include only those where the 'isArchived' field is true
     * @param {Function} q - The query function provided by the filtering system
     * @returns {Array} An array of objects where isArchived is true
     */
    const userId = identity.subject;
/**
 * Asynchronously restores a document and its children from archived state.
 * @param {Object} ctx - The context object containing authentication and database access.
 * @param {Object} args - The arguments object containing the document ID.
 * @param {string} args.id - The ID of the document to restore.
 * @returns {Promise<Object>} The restored document object.
 * @throws {Error} If the user is not authenticated, document is not found, or user is unauthorized.
 */

    const documents = await ctx.db
      .query("documents")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .filter((q) =>
        q.eq(q.field("isArchived"), true),
      )
      .order("desc")
      .collect();

    return documents;
  }
});

export const restore = mutation({
  args: { id: v.id("documents") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Not authenticated");
    }

    const userId = identity.subject;

    const existingDocument = await ctx.db.get(args.id);

    if (!existingDocument) {
      throw new Error("Not found");
    }
```
/**
 * Recursively restores a document and all its child documents from archived state.
 * @param {Id<"documents">} documentId - The ID of the parent document to restore.
 * @returns {Promise<void>} A promise that resolves when the restoration is complete.
 */
```

    if (existingDocument.userId !== userId) {
      throw new Error("Unauthorized");
    }

    const recursiveRestore = async (documentId: Id<"documents">) => {
      const children = await ctx.db
        .query("documents")
        ```
        /**
         * Adds an index to the query to filter documents by user and parent document
         * @param {function} q - The query function to be chained
         * @returns {function} A query function with added equality filters for userId and parentDocument
         */
        ```
        .withIndex("by_user_parent", (q) => (
          q
            .eq("userId", userId)
            .eq("parentDocument", documentId)
        ))
        .collect();

      for (const child of children) {
        await ctx.db.patch(child._id, {
          isArchived: false,
        });

        await recursiveRestore(child._id);
      }
    }

    const options: Partial<Doc<"documents">> = {
      isArchived: false,
    };

    if (existingDocument.parentDocument) {
      const parent = await ctx.db.get(existingDocument.parentDocument);
      if (parent?.isArchived) {
        options.parentDocument = undefined;
      }
    }

    const document = await ctx.db.patch(args.id, options);

    recursiveRestore(args.id);
```
/**
 * Deletes a document from the database after performing authentication and authorization checks.
 * @param {Object} ctx - The context object containing authentication and database access methods.
 * @param {Object} args - The arguments object containing the document ID to be deleted.
 * @param {string} args.id - The ID of the document to be deleted.
 * @returns {Object} The deleted document object.
 * @throws {Error} If the user is not authenticated, the document is not found, or the user is unauthorized.
 */

```
    return document;
  }
});

export const remove = mutation({
  args: { id: v.id("documents") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Not authenticated");
    }

    const userId = identity.subject;

    const existingDocument = await ctx.db.get(args.id);

    if (!existingDocument) {
      throw new Error("Not found");
    }

    if (existingDocument.userId !== userId) {
      throw new Error("Unauthorized");
    }

    const document = await ctx.db.delete(args.id);

    return document;
  }
});

export const getSearch = query({
  /**
   * Retrieves non-archived documents for an authenticated user
   * @param {Object} ctx - The context object containing authentication and database access
   * @returns {Promise<Array>} A promise that resolves to an array of non-archived documents for the user
   */
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Not authenticated");
    }

    const userId = identity.subject;

    const documents = await ctx.db
      .query("documents")
      /**
       * Adds an index to the query based on the user ID
       * @param {function} q - The query function to be extended
       * @returns {Query} The modified query with the added index
       */
      .withIndex("by_user", (q) => q.eq("userId", userId))
      /**
       * Filters the query to exclude archived items
       * @param {Function} q - Query function provided by the database API
       * @returns {Function} Modified query that filters out archived items
       */
      .filter((q) =>
        q.eq(q.field("isArchived"), false),
      )
      .order("desc")
      .collect()

    return documents;
  }
});

export const getById = query({
  args: { documentId: v.id("documents") },
  ```
  /**
   * Retrieves a document based on authentication and authorization checks.
   * @param {Object} ctx - The context object containing authentication and database access.
   * @param {Object} args - The arguments object containing the document ID.
   * @param {string} args.documentId - The ID of the document to retrieve.
   * @returns {Object} The retrieved document if authorized, or throws an error otherwise.
   * @throws {Error} If the document is not found, user is not authenticated, or user is unauthorized.
   */
  ```
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    const document = await ctx.db.get(args.documentId);

    if (!document) {
      throw new Error("Not found");
    }

    if (document.isPublished && !document.isArchived) {
      return document;
    }

    if (!identity) {
      throw new Error("Not authenticated");
    }

    const userId = identity.subject;

    if (document.userId !== userId) {
      throw new Error("Unauthorized");
    }

    return document;
  }
});

export const update = mutation({
  args: {
    id: v.id("documents"),
    title: v.optional(v.string()),
    content: v.optional(v.string()),
    coverImage: v.optional(v.string()),
    icon: v.optional(v.string()),
    isPublished: v.optional(v.boolean())
  },
  /**
   * Updates an existing document in the database after authentication and authorization checks.
   * @param {Object} ctx - The context object containing authentication and database access.
   * @param {Object} args - The arguments object containing the document ID and update data.
   * @param {string} args.id - The ID of the document to update.
   * @returns {Object} The updated document.
   * @throws {Error} If the user is unauthenticated, the document is not found, or the user is unauthorized.
   */
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Unauthenticated");
    }

    const userId = identity.subject;

    const { id, ...rest } = args;

    const existingDocument = await ctx.db.get(args.id);

    if (!existingDocument) {
      throw new Error("Not found");
    }

    if (existingDocument.userId !== userId) {
      throw new Error("Unauthorized");
    }

    const document = await ctx.db.patch(args.id, {
      ...rest,
    });

    return document;
  },
});

export const removeIcon = mutation({
  args: { id: v.id("documents") },
  /**
   * Removes the icon from a document after authenticating the user and verifying ownership.
   * @param {Object} ctx - The context object containing authentication and database access.
   * @param {Object} args - The arguments object containing the document ID.
   * @param {string} args.id - The ID of the document to update.
   * @returns {Object} The updated document with the icon removed.
   * @throws {Error} If the user is unauthenticated, the document is not found, or the user is unauthorized.
   */
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Unauthenticated");
    }

    const userId = identity.subject;

    const existingDocument = await ctx.db.get(args.id);

    if (!existingDocument) {
      throw new Error("Not found");
    }

    if (existingDocument.userId !== userId) {
      throw new Error("Unauthorized");
    }

    const document = await ctx.db.patch(args.id, {
      icon: undefined
    });

    return document;
  }
});

export const removeCoverImage = mutation({
  args: { id: v.id("documents") },
  /**
   * Removes the cover image from a document
   * @param {Object} ctx - The context object containing authentication and database access
   * @param {Object} args - The arguments object containing the document ID
   * @param {string} args.id - The ID of the document to update
   * @returns {Object} The updated document with the cover image removed
   * @throws {Error} If the user is unauthenticated, the document is not found, or the user is unauthorized
   */
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Unauthenticated");
    }

    const userId = identity.subject;

    const existingDocument = await ctx.db.get(args.id);

    if (!existingDocument) {
      throw new Error("Not found");
    }

    if (existingDocument.userId !== userId) {
      throw new Error("Unauthorized");
    }

    const document = await ctx.db.patch(args.id, {
      coverImage: undefined,
    });

    return document;
  }
});
