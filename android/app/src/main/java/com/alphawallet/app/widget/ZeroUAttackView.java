package com.alphawallet.app.widget;

import android.content.Context;
import android.content.res.TypedArray;
import android.graphics.Canvas;
import android.graphics.Color;
import android.graphics.DashPathEffect;
import android.graphics.Paint;
import android.graphics.Path;
import android.graphics.Point;
import android.graphics.Rect;
import android.graphics.RectF;
import android.util.AttributeSet;
import android.view.View;

import androidx.annotation.Nullable;
import androidx.core.content.ContextCompat;

import com.alphawallet.app.R;
import com.alphawallet.app.entity.Tuple2;

public class ZeroUAttackView extends View {

    private int victimOvalFillColor;

    private int attackerOvalFillColor;

    private int usualOvalFillColor;

    private int addrTextSize;

    private float lineWidth;

    private float ovalTextSize;

    private String[] attackerAddrSegments;

    private String[] usualAddrAddrSegments;

    private Integer addrHeadChars;

    private Integer addrTailChars;

    private int paddingLeft;

    private int paddingRight;

    private int paddingTop;

    private int paddingBottom;

    private int viewWidth;

    private int viewHeight;

    private final Paint paint = new Paint();

    private float ovalWidth;

    private float ovalHeight;

    private float ovalHeightRatio;

    private float ovalTextHorizontalPadding;

    private float ovalTextVerticalPadding;

    private float ovalTextLineMargin;

    private float hintTextSize;

    private float hintTextLineMargin;

    private final int addrLineMarginDp = 8;

    private boolean animateNow;

    private boolean drawNow = true;

    private void init(Context context, AttributeSet attrs, int defStyleAttr, int defStyleRes) {
        initAttrs(context, attrs, defStyleAttr, defStyleRes);
        paint.setAntiAlias(true);
        paint.setTextAlign(Paint.Align.CENTER);
        measureOvalTextMetrics();
    }

    public ZeroUAttackView(Context context) {
        super(context);
        init(context, null, 0, 0);
    }

    public ZeroUAttackView(Context context, @Nullable AttributeSet attrs) {
        super(context, attrs);
        init(context, attrs, 0, 0);
    }

    public ZeroUAttackView(Context context, @Nullable AttributeSet attrs, int defStyleAttr) {
        super(context, attrs, defStyleAttr);
        init(context, attrs, defStyleAttr, 0);
    }

    public ZeroUAttackView(Context context, @Nullable AttributeSet attrs, int defStyleAttr, int defStyleRes) {
        super(context, attrs, defStyleAttr, defStyleRes);
        init(context, attrs, defStyleAttr, defStyleRes);
    }

    private static final String receiverText = "recipient account";

    private static final String phishingLine1 = "A. Phishing";

    private static final String usualLine1 = "B. Inferred";

    private static final String selfText = "Your account";

    private void measureOvalTextMetrics() {
        String[] widthMeasureTexts = new String[]{
                receiverText,
                selfText,
        };
        String[] line1MeasureTexts = new String[]{
                phishingLine1,
                usualLine1
        };
        int maxWidth = 0;
        for (String text : widthMeasureTexts) {
            final Rect rect = measureTextRect(text, ovalTextSize);
            maxWidth = Math.max(maxWidth, rect.width());
        }
        float ovalWidth = maxWidth + ovalTextHorizontalPadding * 2;
        int maxLine1Height = 0;
        for (String text : line1MeasureTexts) {
            final Rect rect = measureTextRect(text, ovalTextSize);
            maxLine1Height = Math.max(maxLine1Height, rect.height());
        }
        int line2Height = measureTextRect(receiverText, ovalTextSize).height();
        float minHeight = maxLine1Height + ovalTextLineMargin + line2Height + ovalTextVerticalPadding * 2;
        float ovalHeight = Math.max(minHeight, ovalWidth * ovalHeightRatio);
        this.ovalWidth = ovalWidth;
        this.ovalHeight = ovalHeight;
    }

    @Override
    protected void onMeasure(int widthMeasureSpec, int heightMeasureSpec) {
        super.onMeasure(widthMeasureSpec, heightMeasureSpec);
        viewWidth = MeasureSpec.getSize(widthMeasureSpec);
        viewHeight = MeasureSpec.getSize(heightMeasureSpec);
    }

    @Override
    protected void onDraw(Canvas canvas) {
//        drawTextVictimAddr(canvas);
        drawTextAttackerAddr(canvas);
        drawTextUsualAddr(canvas);
        drawLineVictimToAttacker(canvas);
        drawLineVictimToUsual(canvas);
        drawLineAttackerToUsual(canvas);
        drawOvalVictim(canvas);
        drawOvalAttacker(canvas);
        drawOvalUsual(canvas);
        if (animateNow) {
            postDelayed(new Runnable() {
                @Override
                public void run() {
                    invalidate();
                }
            }, 700L);
        }
    }

    private boolean drawNow() {
        if (!animateNow) {
            return true;
        }
        drawNow = !drawNow;
        return !drawNow;
    }

    public void drawCurveLine(Canvas canvas, int x1, int y1, int x2, int y2, int curveRadius,
                              int color, int lineWidth, boolean positive) {

        Paint paint  = new Paint();
        paint.setAntiAlias(true);
        paint.setStyle(Paint.Style.STROKE);
        paint.setStrokeWidth(lineWidth);
        paint.setColor(ContextCompat.getColor(getContext(), color));

        final Path path = new Path();
        int midX            = x1 + ((x2 - x1) / 2);
        int midY            = y1 + ((y2 - y1) / 2);
        float xDiff         = midX - x1;
        float yDiff         = midY - y1;
        double angle        = (Math.atan2(yDiff, xDiff) * (180 / Math.PI)) + (positive ? - 90 : 90);
        double angleRadians = Math.toRadians(angle);
        float pointX        = (float) (midX + curveRadius * Math.cos(angleRadians));
        float pointY        = (float) (midY + curveRadius * Math.sin(angleRadians));

        path.moveTo(x1, y1);
        path.cubicTo(x1,y1,pointX, pointY, x2, y2);
        canvas.drawPath(path, paint);
    }

    private void drawLineVictimToAttacker(Canvas canvas) {
        final Point victimCenter = getVictimOvalCenter();
        final Point attackerCenter = getAttackerOvalCenter();
        float halfOvalWidth = ovalWidth / 2.f;
        float halfOvalHeight = ovalHeight / 2.f;
        double redLineStartAngle = Math.PI;
        double redLineEndAngle = Math.PI / 2;
        double blackLineStartAngle = Math.PI * 1.4;
        double blackLineEndAngle = Math.PI / 4;
        double redLineEndX = attackerCenter.x + halfOvalWidth * Math.cos(redLineEndAngle);
        double redLineEndY = attackerCenter.y + halfOvalHeight * Math.sin(redLineEndAngle);
        double blackLineEndX = attackerCenter.x + halfOvalWidth * Math.cos(blackLineEndAngle);
        double blackLIneEndY = attackerCenter.y + halfOvalHeight * Math.cos(blackLineEndAngle);
        boolean drawNow = drawNow();
        if (drawNow) {
            drawCurve(canvas, redLineStartAngle, victimCenter, redLineEndAngle, attackerCenter, R.color.danger,
                    true);
            drawArrow(canvas, new Point((int) redLineEndX,(int) redLineEndY), 90, 60, pxFromDp(getContext(), 6),
                    R.color.danger);
        }
        drawCurve(canvas, blackLineStartAngle, victimCenter, blackLineEndAngle, attackerCenter,
                R.color.black, false);
        drawArrow(canvas, new Point((int) blackLineEndX, (int) blackLIneEndY), 30, 60, pxFromDp(getContext(), 6),
                R.color.black);

        String attackHintLine1 = "0U scam transfer";
        String attackHintLine2 = "2023/04/01 13:55:35";
        float topOffset = pxFromDp(getContext(), 15);
        canvas.save();
        Rect line1Rect = measureTextRect(attackHintLine2, hintTextSize);
        float hintLine1HalfHeight = line1Rect.height() / 2.f;
        int realX = Math.max(paddingLeft + line1Rect.width() / 2, attackerCenter.x) + (int) pxFromDp(getContext(), 100);
        canvas.translate(realX, attackerCenter.y + ovalHeight / 2 + topOffset + hintLine1HalfHeight);
        paint.setColor(attackerOvalFillColor);
        canvas.drawText(attackHintLine1, 0, 0, paint);
        canvas.translate(0, hintTextLineMargin + hintLine1HalfHeight * 2);
        canvas.drawText(attackHintLine2, 0, 0, paint);
        canvas.restore();

        if (drawNow) {
            String warnHintLine1 = "850,000 USDT";
            String warnHintLine2 = "NOW";
            float topOffset2 = pxFromDp(getContext(), 60);
            canvas.save();
            Rect warnLine1Rect = measureTextRect(warnHintLine1, hintTextSize);
            float warnHintLine1HalfHeight = warnLine1Rect.height() / 2.f;
            int warnRealX = Math.max(paddingLeft + warnLine1Rect.width() / 2, attackerCenter.x) + (int) pxFromDp(getContext(), 10);
            canvas.translate(warnRealX, attackerCenter.y + ovalHeight / 2 + topOffset2 + warnHintLine1HalfHeight);
            paint.setColor(Color.RED);
            canvas.drawText(warnHintLine1, 0, 0, paint);
            canvas.translate(0, hintTextLineMargin + warnHintLine1HalfHeight * 2);
            canvas.drawText(warnHintLine2, 0, 0, paint);
            canvas.restore();
        }
    }

    private void drawArrow(Canvas canvas, Point endPoint, float rotateAngle, float topAngle,
                           float height, int colorRes) {
        canvas.save();
        canvas.translate(endPoint.x, endPoint.y);
        canvas.rotate(rotateAngle);
        float x = height;
        float y = (float) Math.tan(topAngle / 2 / 180 * Math.PI) * height;
        Path path = new Path();
        path.moveTo(0, 0);
        path.lineTo(x, y);
        path.lineTo(x, -y);
        path.close();
        Paint p = new Paint();
        p.setColor(ContextCompat.getColor(getContext(), colorRes));
        p.setAntiAlias(true);
        p.setStyle(Paint.Style.FILL);
        canvas.drawPath(path, p);
        canvas.restore();
    }

    private void drawCurve(Canvas canvas, double startAngle, Point startOvalCenter, double endAngle,
                           Point endOvalCenter, int colorRes, boolean positive) {
        float halfOvalWidth = ovalWidth / 2.f;
        float halfOvalHeight = ovalHeight / 2.f;
        double startX =  startOvalCenter.x + halfOvalWidth * Math.cos(startAngle);
        double startY = startOvalCenter.y + halfOvalHeight * Math.sin(startAngle);
        double endX = endOvalCenter.x + halfOvalWidth * Math.cos(endAngle);
        double endY = endOvalCenter.y + halfOvalHeight * Math.sin(endAngle);
        drawCurveLine(canvas, (int)startX, (int)startY, (int)endX, (int)endY,
                100, colorRes,  (int)lineWidth, positive);
    }

    private void drawLineVictimToUsual(Canvas canvas) {
        final Point victimCenter = getVictimOvalCenter();
        final Point usualCenter = getUsualOvalCenter();
        final double endAngle = Math.PI / 2;
        drawCurve(canvas, 0, victimCenter,
                endAngle, usualCenter, R.color.green, false);
        float halfOvalWidth = ovalWidth / 2.f;
        float halfOvalHeight = ovalHeight / 2.f;
        double endX = usualCenter.x + halfOvalWidth * Math.cos(endAngle);
        double endY = usualCenter.y + halfOvalHeight * Math.sin(endAngle);
        Point endPoint = new Point((int) endX, (int) endY);
        drawArrow(canvas, endPoint, 100, 60, pxFromDp(getContext(), 6), R.color.green);
        String line1 = "Normal transfer";
        String line2 = "2023/04/01 13:54:59";
        float topOffset = pxFromDp(getContext(), 30);
        canvas.save();
        Rect line1Rect = measureTextRect(line1, hintTextSize);
        float hintLine1HalfHeight = line1Rect.height() / 2.f;
        int realX = Math.min(viewWidth - paddingRight - line1Rect.width() / 2, usualCenter.x);
        canvas.translate(realX, usualCenter.y + ovalHeight / 2 + topOffset + hintLine1HalfHeight);
        paint.setColor(usualOvalFillColor);
        canvas.drawText(line1, 0, 0, paint);
        canvas.translate(0, hintTextLineMargin + hintLine1HalfHeight * 2);
        canvas.drawText(line2, 0, 0, paint);
        canvas.restore();
    }

    private void drawLineAttackerToUsual(Canvas canvas) {
        final Point attackerCenter = getAttackerOvalCenter();
        final Point usualCenter = getUsualOvalCenter();
        final Point center = new Point((attackerCenter.x + usualCenter.x) / 2,
                (attackerCenter.y + usualCenter.y) / 2);
        canvas.save();
        canvas.translate(center.x, center.y);
        canvas.drawText("Similar Addresses", 0, -pxFromDp(getContext(), 5), paint);
        canvas.restore();
        drawDashLine(canvas, attackerCenter, usualCenter, Color.BLACK, lineWidth, false);
    }

    private void drawDashLine(Canvas canvas, Point start, Point end, int color, float strokeWidth,
                              boolean drawArrow) {
        paint.setColor(color);
        paint.setStrokeWidth(strokeWidth);
        paint.setPathEffect(new DashPathEffect(new float[]{20, 20, 20, 20}, 0));
        if (!drawArrow) {
            canvas.drawLine(start.x, start.y, end.x, end.y, paint);
        } else {
            double distance = distance(start, end);
//            drawArrow(canvas, start.x, start.y, (float) endX, (float) endY, paint);
        }
    }

    private double distance(Point start, Point end) {
        return Math.sqrt(Math.pow(Math.abs(start.x - end.x), 2) + Math.pow(Math.abs(start.y - end.y), 2));
    }

    private void drawTextAttackerAddr(Canvas canvas) {
        final Point attackerAddrOrigin = getAttackerAddrOrigin();
        canvas.save();
        String firstSeg = attackerAddrSegments[0];
        String secondSeg = attackerAddrSegments[1];
        String thirdSeg = attackerAddrSegments[2];
        canvas.translate(attackerAddrOrigin.x, attackerAddrOrigin.y);
        paint.setColor(attackerOvalFillColor);
        canvas.drawText(secondSeg, 0, 0, paint);
        int yOffset = (int) (measureTextRect(firstSeg, addrTextSize).height() +
                measureTextRect(secondSeg, addrTextSize).height()) / 2;
        yOffset += pxFromDp(getContext(), addrLineMarginDp);
        canvas.translate(0, - yOffset);
        canvas.drawText(firstSeg, 0, 0, paint);
        canvas.translate(0, yOffset * 2);
        canvas.drawText(thirdSeg, 0, 0, paint);
        canvas.restore();
    }

    private void drawTextUsualAddr(Canvas canvas) {
        final Point usualAddrOrigin = getUsualAddrOrigin();
        canvas.save();
        String firstSeg = usualAddrAddrSegments[0];
        String secondSeg = usualAddrAddrSegments[1];
        String thirdSeg = usualAddrAddrSegments[2];
        canvas.translate(usualAddrOrigin.x, usualAddrOrigin.y);
        paint.setColor(usualOvalFillColor);
        canvas.drawText(secondSeg, 0, 0, paint);
        int yOffset = (int) (measureTextRect(firstSeg, addrTextSize).height() +
                measureTextRect(secondSeg, addrTextSize).height()) / 2;
        yOffset += pxFromDp(getContext(), addrLineMarginDp);
        canvas.translate(0, - yOffset);
        canvas.drawText(firstSeg, 0, 0, paint);
        canvas.translate(0, yOffset * 2);
        canvas.drawText(thirdSeg, 0, 0, paint);
        canvas.restore();
    }

    private Rect measureTextRect(String text, float textSize) {
        final Rect rect = new Rect();
        paint.setTextSize(textSize);
        paint.getTextBounds(text, 0, text.length(), rect);
        return rect;
    }

    private Point getAttackerAddrOrigin() {
        final Tuple2<Integer, Integer> metrics = measureAddrSegment(attackerAddrSegments, addrTextSize);
        int x = paddingLeft + (int) Math.max(ovalWidth, metrics.component1()) / 2;
        int y = paddingTop + metrics.component2() / 2;
        return new Point(x, y);
    }

    private Point getUsualAddrOrigin() {
        final Tuple2<Integer, Integer> metrics = measureAddrSegment(usualAddrAddrSegments, addrTextSize);
        int x = viewWidth - paddingRight - (int) Math.max(ovalWidth, metrics.component1()) / 2;
        int y = paddingTop + metrics.component2() / 2;
        return new Point(x, y);
    }

    public static float dpFromPx(final Context context, final float px) {
        return px / context.getResources().getDisplayMetrics().density;
    }

    public static float pxFromDp(final Context context, final float dp) {
        return dp * context.getResources().getDisplayMetrics().density;
    }

    private Point getVictimOvalCenter() {
        int x = (viewWidth - paddingLeft - paddingBottom) / 2;
        int y = viewHeight - paddingBottom - (int) (ovalHeight / 2);
        return new Point(x, y);
    }

    private Point getUsualOvalCenter() {
        final Tuple2<Integer, Integer> metrics = measureAddrSegment(usualAddrAddrSegments, addrTextSize);
        int x = viewWidth - paddingRight - (int) (ovalWidth / 2);
        int y = paddingTop + metrics.component2() + (int) (ovalHeight / 2) + (int) pxFromDp(getContext(), 10);
        return new Point(x, y);
    }

    private Tuple2<Integer, Integer> measureAddrSegment(String[] addrSegments, float textSize) {
        int height = 0;
        int width = 0;
        for (String seg: addrSegments) {
            Rect rect = measureTextRect(seg, textSize);
            height += rect.height();
            width = Math.max(rect.width(), width);
        }
        height += (addrSegments.length - 1) * dpFromPx(getContext(), addrLineMarginDp);
        return new Tuple2<>(width, height);
    }

    private Point getAttackerOvalCenter() {
        final Tuple2<Integer, Integer> metrics = measureAddrSegment(attackerAddrSegments, addrTextSize);
        int x = paddingLeft + (int) (ovalWidth / 2);
        int y = paddingTop + metrics.component2() + (int) (ovalHeight / 2) + (int) pxFromDp(getContext(), 5);
        return new Point(x, y);
    }

    private void drawOvalVictim(Canvas canvas) {
        final Point center = getVictimOvalCenter();
        drawAddrOval(canvas, center, victimOvalFillColor, new String[]{selfText});
    }

    private void drawOvalAttacker(Canvas canvas) {
        final Point center = getAttackerOvalCenter();
        Paint p = new Paint();
        canvas.drawCircle(center.x, center.y, 10, p);
        drawAddrOval(canvas, center, attackerOvalFillColor, new String[]{
                phishingLine1,
                receiverText
        });
    }

    private void drawOvalUsual(Canvas canvas) {
        final Point center = getUsualOvalCenter();
        drawAddrOval(canvas, center, usualOvalFillColor, new String[]{
                usualLine1,
                receiverText
        });
    }

    private void drawAddrOval(Canvas canvas, Point center, int fillColor, String[] ovalTextLines) {
        paint.setColor(fillColor);
        canvas.save();
        canvas.translate(center.x, center.y);
        final float halfWidth = ovalWidth / 2.f;
        final float halfHeight = ovalHeight / 2.f;
        final RectF rect = new RectF(-halfWidth, -halfHeight, halfWidth, halfHeight);
        canvas.drawOval(rect, paint);
        canvas.restore();
        paint.setTextAlign(Paint.Align.CENTER);
        paint.setTextSize(ovalTextSize);
        float yBaselineOffset = (paint.descent() + paint.ascent()) / 2.f;
        paint.setColor(getResources().getColor(R.color.white, null));
        if (ovalTextLines.length == 1) {
            canvas.save();
            canvas.translate(center.x, center.y - yBaselineOffset);
            canvas.drawText(ovalTextLines[0], 0, 0, paint);
            canvas.restore();
        } else {
            String firstLine = ovalTextLines[0];
            String secondLine = ovalTextLines[1];
            float firstLineY = -(ovalTextLineMargin + measureTextRect(firstLine, ovalTextSize).height() - yBaselineOffset) / 2.f;
            float secondLineY = (ovalTextLineMargin + measureTextRect(secondLine, ovalTextSize).height() - yBaselineOffset) / 2.f;
            paint.setTextAlign(Paint.Align.CENTER);
            canvas.save();
            canvas.translate(center.x, center.y);
            canvas.drawText(firstLine, 0, firstLineY, paint);
            canvas.drawText(secondLine, 0, secondLineY, paint);
            canvas.restore();
        }
    }

    private void initAttrs(Context context, AttributeSet attrs, int defStyleAttr, int defStyleRes) {

        final TypedArray typedArray = context.obtainStyledAttributes(attrs, R.styleable.ZeroUAttackView, defStyleAttr, defStyleRes);
        try {
            victimOvalFillColor = typedArray.getColor(R.styleable.ZeroUAttackView_victimOvalFillColor, Color.BLACK);
            attackerOvalFillColor = typedArray.getColor(R.styleable.ZeroUAttackView_attackerOvalFillColor, Color.BLACK);
            usualOvalFillColor = typedArray.getColor(R.styleable.ZeroUAttackView_usualOvalFillColor, Color.BLACK);
            addrTextSize = typedArray.getDimensionPixelSize(R.styleable.ZeroUAttackView_addrTextSize, 5);
            addrHeadChars = typedArray.getInteger(R.styleable.ZeroUAttackView_addrHeadChars, 5);
            addrTailChars = typedArray.getInteger(R.styleable.ZeroUAttackView_addrTailChars, 5);
            paddingLeft = typedArray.getDimensionPixelSize(R.styleable.ZeroUAttackView_android_paddingLeft, 0);
            paddingRight = typedArray.getDimensionPixelSize(R.styleable.ZeroUAttackView_android_paddingRight, 0);
            paddingTop = typedArray.getDimensionPixelSize(R.styleable.ZeroUAttackView_android_paddingTop, 0);
            paddingBottom = typedArray.getDimensionPixelSize(R.styleable.ZeroUAttackView_android_paddingBottom, 0);
            lineWidth = typedArray.getDimension(R.styleable.ZeroUAttackView_lineWidth, 1);
            ovalTextSize = typedArray.getDimensionPixelSize(R.styleable.ZeroUAttackView_ovalTextSize, 1);
            ovalTextHorizontalPadding = typedArray.getDimensionPixelSize(R.styleable.ZeroUAttackView_ovalTextHorizontalPadding, 0);
            ovalHeightRatio = typedArray.getFloat(R.styleable.ZeroUAttackView_ovalHeightRatio, 0.3f);
            ovalTextVerticalPadding = typedArray.getDimensionPixelSize(R.styleable.ZeroUAttackView_ovalTextVerticalPadding, 0);
            ovalTextLineMargin = typedArray.getDimensionPixelSize(R.styleable.ZeroUAttackView_ovalTextLineMargin, 0);
            hintTextSize = typedArray.getDimensionPixelSize(R.styleable.ZeroUAttackView_hintTextSize, 0);
            hintTextLineMargin = typedArray.getDimensionPixelSize(R.styleable.ZeroUAttackView_hintTextLineMargin, 0);
            animateNow = typedArray.getBoolean(R.styleable.ZeroUAttackView_animateNow, true);
        } finally {
            typedArray.recycle();
        }
    }

    public void setAddrs(String victimAddr, String attackerAddr, String usualAddr) {
        this.attackerAddrSegments = segmentAddr(attackerAddr, addrHeadChars, addrTailChars);
        this.usualAddrAddrSegments = segmentAddr(usualAddr, addrHeadChars, addrTailChars);
    }

    private static boolean prefixWith0x(String addr) {
        return addr.startsWith("0x") || addr.startsWith("0X");
    }

    private static String[] segmentAddr(String addr, int headChars, int tailChars) {
        headChars = Math.min(headChars, 33);
        tailChars = Math.min(tailChars, 33);
        if (prefixWith0x(addr)) {
            addr = addr.substring(2);
        }
        final String[] segments = new String[3];
        segments[0] = "0x" + addr.substring(0, headChars);
        segments[1] = addr.substring(headChars, addr.length() - tailChars);
        segments[2] = addr.substring(addr.length() - tailChars);
        return segments;
    }
}
