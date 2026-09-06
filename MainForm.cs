using System.Drawing;

namespace ClickFor500;

public sealed class MainForm : Form
{
    private readonly Button claimButton;
    private readonly Random random = new();
    private int clickCount;
    private bool isRelocating;

    public MainForm()
    {
        Text = "Free Money";
        StartPosition = FormStartPosition.CenterScreen;
        ClientSize = new Size(720, 420);
        MinimumSize = new Size(520, 320);
        BackColor = Color.White;

        var offerLabel = new Label
        {
            AutoSize = true,
            Text = "Click for ₱500",
            Font = new Font("Segoe UI", 24F, FontStyle.Bold),
            ForeColor = Color.FromArgb(31, 41, 55),
            Location = new Point(246, 95)
        };

        claimButton = new Button
        {
            AutoSize = false,
            Size = new Size(180, 55),
            Text = "CLAIM NOW",
            Font = new Font("Segoe UI", 12F, FontStyle.Bold),
            BackColor = Color.FromArgb(22, 163, 74),
            ForeColor = Color.White,
            FlatStyle = FlatStyle.Flat,
            Cursor = Cursors.Hand,
            Location = new Point(270, 205)
        };
        claimButton.FlatAppearance.BorderSize = 0;
        claimButton.MouseEnter += ClaimButton_MouseEnter;
        claimButton.Click += ClaimButton_Click;

        Controls.Add(offerLabel);
        Controls.Add(claimButton);
        MouseMove += MainForm_MouseMove;
        Resize += MainForm_Resize;
    }

    private void MainForm_MouseMove(object? sender, MouseEventArgs e)
    {
        var dangerZone = claimButton.Bounds;
        dangerZone.Inflate(70, 70);

        if (dangerZone.Contains(e.Location))
        {
            RelocateButton();
        }
    }

    private void ClaimButton_MouseEnter(object? sender, EventArgs e)
    {
        RelocateButton();
    }

    private void ClaimButton_Click(object? sender, EventArgs e)
    {
        clickCount++;
        MessageBox.Show(
            this,
            "Nice try, hacker!",
            "Access denied",
            MessageBoxButtons.OK,
            MessageBoxIcon.Information);
    }

    private void MainForm_Resize(object? sender, EventArgs e)
    {
        KeepButtonInsideForm();
    }

    private void RelocateButton()
    {
        if (isRelocating || !IsHandleCreated)
        {
            return;
        }

        isRelocating = true;
        try
        {
            var maxX = Math.Max(0, ClientSize.Width - claimButton.Width);
            var maxY = Math.Max(0, ClientSize.Height - claimButton.Height);
            claimButton.Location = new Point(
                random.Next(maxX + 1),
                random.Next(maxY + 1));
        }
        finally
        {
            isRelocating = false;
        }
    }

    private void KeepButtonInsideForm()
    {
        var x = Math.Clamp(claimButton.Left, 0, Math.Max(0, ClientSize.Width - claimButton.Width));
        var y = Math.Clamp(claimButton.Top, 0, Math.Max(0, ClientSize.Height - claimButton.Height));
        claimButton.Location = new Point(x, y);
    }
}
