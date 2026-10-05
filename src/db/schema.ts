import {
    pgEnum,
    pgTable,
    uuid,
    varchar,
    text,
    timestamp,
    uniqueIndex,
    index
} from "drizzle-orm/pg-core"

export const users = pgTable("users",{
    id: uuid("id").defaultRandom().primaryKey(),

    name: varchar("name",{
        length: 255,
    }).notNull(),

    email: varchar("email",{
        length: 255
    })
    .notNull()
    .unique(),

    passwordHash: varchar("password_hash",{
        length:255,
    })
    .notNull(),

    createdAt: timestamp("created_at",{
        withTimezone: true
    })
    .defaultNow()
    .notNull(),

    updatedAt: timestamp("updated_at",{
        withTimezone: true,
    })
    .defaultNow()
    .notNull()
})

export const workspaces = pgTable("workspaces",{
    id: uuid("id").defaultRandom().primaryKey(),

    name: varchar("name",{
        length: 255
    })
    .notNull(),

    slug: varchar("slug", {
        length: 255
    })
    .notNull()
    .unique(),

    createdBy: uuid("created_by")
        .notNull()
        .references(()=>users.id,{
            onDelete:"restrict"
        }),

    createdAt: timestamp("created_at",{
        withTimezone: true
    })
    .defaultNow()
    .notNull(),

    updatedAt: timestamp("updated_at",{
        withTimezone: true,
    })
    .defaultNow()
    .notNull()

})

export const workspaceRoleEnum = pgEnum("workspace_role",[
    "OWNER",
    "ADMIN",
    "MEMBER"
])

export const workspace_members = pgTable("workspace_members",{
    id: uuid("id").defaultRandom().primaryKey(),
    
    workspaceId: uuid("workspace_id")
        .notNull()
        .references(()=>workspaces.id,{
            onDelete: "cascade"
        }),

    userId: uuid("user_id")
        .notNull()
        .references(()=>users.id,{
            onDelete:"cascade"
        }),
    
    role: workspaceRoleEnum("role")
        .default("MEMBER")
        .notNull(),

    joinedAt: timestamp("joined_at",{
        withTimezone: true
    })
    .defaultNow()
    .notNull()
},(table)=> [
    uniqueIndex("workspace_members_workspace_user_unique").on(
        table.workspaceId,
        table.userId
    ),
    index("workspace_members_user_idx").on(table.userId),
    index("workspace_members_workspace_idx").on(table.workspaceId)
])

export const projects = pgTable("projects",{
    id: uuid("id").defaultRandom().primaryKey(),

    workspaceId: uuid("workspace_id")
        .notNull()
        .references(()=>workspaces.id,{
            onDelete: "cascade"
        }),

    name: varchar("name",{
        length: 255,
    })
    .notNull(),

    description: text("description"),

    createdBy: uuid("created_by")
        .notNull()
        .references(()=>users.id,{
            onDelete: "restrict"
        }),

    createdAt: timestamp("created_at",{
        withTimezone: true
    })
    .defaultNow()
    .notNull(),

    updatedAt: timestamp("updated_at",{
        withTimezone: true
    })
    .defaultNow()
    .notNull()
},(table)=> [
    index("project_workspace_idx").on(table.workspaceId)
])

export const taskStatusEnum = pgEnum("task_status",[
    "TODO",
    "IN_PROGRESS",
    "DONE"
])

export const taskPriorityEnum = pgEnum("task_priority",[
    "LOW",
    "MEDIUM",
    "HIGH"
])

export const tasks = pgTable("tasks",{
    id: uuid("id").defaultRandom().primaryKey(),

    projectId: uuid("project_id")
        .notNull()
        .references(()=>projects.id,{
            onDelete:"cascade"
        }),

    title: varchar("title",{
        length: 255,
    })
        .notNull(),

    description: text("description"),

    status: taskStatusEnum("status")
        .default("TODO")
        .notNull(),

     priority: taskPriorityEnum("priority")
      .default("MEDIUM")
      .notNull(),

    assignedTo: uuid("assigned_to").references(() => users.id, {
      onDelete: "set null",
    }),

    createdBy: uuid("created_by")
      .notNull()
      .references(() => users.id, {
        onDelete: "restrict",
      }),

    dueDate: timestamp("due_date", {
      withTimezone: true,
    }),

    createdAt: timestamp("created_at", {
      withTimezone: true,
    })
      .defaultNow()
      .notNull(),

    updatedAt: timestamp("updated_at", {
      withTimezone: true,
    })
      .defaultNow()
      .notNull(),

},(table)=>[
    index("tasks_project_idx").on(table.projectId),
    index("tasks_assigned_to_idx").on(table.assignedTo),
    index("tasks_status_idx").on(table.status),
])

export const comments = pgTable("comments", {
    id: uuid("id").defaultRandom().primaryKey(),

    taskId: uuid("task_id")
      .notNull()
      .references(() => tasks.id, {
        onDelete: "cascade",
      }),

    authorId: uuid("author_id")
      .notNull()
      .references(() => users.id, {
        onDelete: "restrict",
      }),

    content: text("content").notNull(),

    createdAt: timestamp("created_at", {
      withTimezone: true,
    })
      .defaultNow()
      .notNull(),

    updatedAt: timestamp("updated_at", {
      withTimezone: true,
    })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index("comments_task_idx").on(table.taskId),
    index("comments_author_idx").on(table.authorId),
  ],)