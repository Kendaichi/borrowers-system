"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import type { ActionResult } from "@/lib/types";

type NewBorrowingInput = {
    borrower_name: string;
    item: string;
    date_borrowed: string;
};

function isValidIsoDate(value: string): boolean {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;

    const date = new Date(`${value}T00:00:00.000Z`);
    return (
        Number.isFinite(date.getTime()) &&
        date.toISOString().slice(0, 10) === value
    );
}

export async function addBorrowing(
    input: NewBorrowingInput,
): Promise<ActionResult> {
    const borrowerName =
        typeof input?.borrower_name === "string" ? input.borrower_name.trim() : "";
    const item = 
        typeof input?.item === "string" ? input.item.trim() : "";
    const dateBorrowed = 
        typeof input?.date_borrowed === "string" ? input.date_borrowed : "";

    if  (!borrowerName) {
        return {
            ok: false, error: "Enter the staff member's name."
        };
    }
    if (!item) {
        return {
            ok: false, error: "Enter the item or equipment."
        };
    }
    if (!isValidIsoDate(dateBorrowed)) {
        return {
            ok: false,
            error: "Enter a valid borrowed date."
        };
    }

    if (!isSupabaseConfigured) {
        return {
            ok: false,
            error: "Preview mode: nothing was saved. Configure Supabse and sign in to save."
        };
    }

    const supabase = await createClient();
    const { error } = await supabase.from("borrowings").insert({
        borrower_name: borrowerName,
        item,
        date_borrowed: dateBorrowed,
    });

    if (error) {
        return {
            ok: false,
            error: `Could not save borrowings: ${error.message}`
        };
    }

    revalidatePath("/");
    redirect("/");
}