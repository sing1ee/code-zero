DO $$ BEGIN
 CREATE TYPE "public"."session_type" AS ENUM('text_assistant', 'mermaid_assistant', 'svg_card_assistant', 'development_assistant', 'chatbot');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "chat_sessions" ADD COLUMN "type" "session_type" DEFAULT 'text_assistant' NOT NULL;